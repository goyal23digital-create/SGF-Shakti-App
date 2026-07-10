import { Router } from 'express';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate, AuthRequest, requireRole } from '../../common/auth.middleware';
import { logAudit } from '../../common/audit';

export const inventoryRouter = Router();
inventoryRouter.use(authenticate);

inventoryRouter.get('/', async (req, res) => {
  const { fyYear, itemId, type, from, to } = req.query;
  const rows = await prisma.inventoryIn.findMany({
    where: {
      isVoided: false,
      ...(fyYear ? { fyYear: String(fyYear) } : {}),
      ...(itemId ? { itemId: Number(itemId) } : {}),
      ...(type ? { type: String(type) as any } : {}),
      ...(from || to
        ? {
            date: {
              ...(from ? { gte: new Date(String(from)) } : {}),
              ...(to ? { lte: new Date(String(to)) } : {}),
            },
          }
        : {}),
    },
    include: { item: { select: { code: true, name: true } } },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  });
  res.json(rows);
});

inventoryRouter.post('/', async (req: AuthRequest, res) => {
  const { date, itemId, quantity, type, remarks, fyYear } = req.body;
  if (!date || !itemId || quantity == null || !fyYear) throw new AppError(400, 'date, itemId, quantity, fyYear required');
  if (Number(quantity) < 0) throw new AppError(400, 'quantity must be non-negative');

  const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
  if (!item) throw new AppError(404, 'Item not found');

  const row = await prisma.$transaction(async (tx) => {
    const r = await tx.inventoryIn.create({
      data: { date: new Date(date), itemId: Number(itemId), quantity, type: type ?? 'PRODUCTION', remarks, fyYear },
    });
    await logAudit(tx, req.userId!, 'CREATE', 'inventory_in', r.id, undefined, r as any);
    return r;
  });
  res.status(201).json(row);
});

inventoryRouter.put('/:id', async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.inventoryIn.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Record not found');
  if (existing.isVoided) throw new AppError(400, 'Record is voided');

  const { date, itemId, quantity, type, remarks, fyYear } = req.body;
  if (quantity != null && Number(quantity) < 0) throw new AppError(400, 'quantity must be non-negative');

  if (itemId) {
    const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
    if (!item) throw new AppError(404, 'Item not found');
  }

  const updated = await prisma.$transaction(async (tx) => {
    const r = await tx.inventoryIn.update({
      where: { id },
      data: {
        ...(date ? { date: new Date(date) } : {}),
        ...(itemId ? { itemId: Number(itemId) } : {}),
        ...(quantity != null ? { quantity } : {}),
        ...(type ? { type } : {}),
        ...(remarks !== undefined ? { remarks } : {}),
        ...(fyYear ? { fyYear } : {}),
      },
      include: { item: { select: { code: true, name: true } } },
    });
    await logAudit(tx, req.userId!, 'UPDATE', 'inventory_in', id, existing as any, r as any);
    return r;
  });
  res.json(updated);
});

inventoryRouter.delete('/:id', requireRole('ADMIN', 'MANAGER'), async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.inventoryIn.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Record not found');

  await prisma.$transaction(async (tx) => {
    await tx.inventoryIn.update({ where: { id }, data: { isVoided: true } });
    await logAudit(tx, req.userId!, 'VOID', 'inventory_in', id, existing as any);
  });
  res.json({ success: true });
});
