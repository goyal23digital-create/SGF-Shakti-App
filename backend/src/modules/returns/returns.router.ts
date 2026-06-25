import { Router } from 'express';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate, AuthRequest, requireRole } from '../../common/auth.middleware';
import { logAudit } from '../../common/audit';
import Decimal from 'decimal.js';

export const returnsRouter = Router();
returnsRouter.use(authenticate);

returnsRouter.get('/', async (req, res) => {
  const { fyYear, partyId, itemId, from, to } = req.query;
  const rows = await prisma.saleReturn.findMany({
    where: {
      isVoided: false,
      ...(fyYear ? { fyYear: String(fyYear) } : {}),
      ...(partyId ? { partyId: Number(partyId) } : {}),
      ...(itemId ? { itemId: Number(itemId) } : {}),
      ...(from || to ? { date: { ...(from ? { gte: new Date(String(from)) } : {}), ...(to ? { lte: new Date(String(to)) } : {}) } } : {}),
    },
    include: {
      item: { select: { code: true, name: true } },
      party: { select: { name: true, city: true } },
    },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  });
  const enriched = rows.map((r) => ({
    ...r,
    value: new Decimal(r.quantity.toString()).mul(r.unitPrice.toString()).toFixed(2),
  }));
  res.json(enriched);
});

returnsRouter.post('/', async (req: AuthRequest, res) => {
  const { date, itemId, quantity, unitPrice, partyId, remarks, fyYear } = req.body;
  if (!date || !itemId || quantity == null || unitPrice == null || !partyId || !fyYear) {
    throw new AppError(400, 'date, itemId, quantity, unitPrice, partyId, fyYear required');
  }
  const row = await prisma.$transaction(async (tx) => {
    const r = await tx.saleReturn.create({
      data: { date: new Date(date), itemId: Number(itemId), quantity, unitPrice, partyId: Number(partyId), remarks, fyYear, createdBy: req.userId },
    });
    await logAudit(tx, req.userId!, 'CREATE', 'sale_returns', r.id, undefined, r as any);
    return r;
  });
  res.status(201).json({ ...row, value: new Decimal(row.quantity.toString()).mul(row.unitPrice.toString()).toFixed(2) });
});

returnsRouter.delete('/:id', requireRole('ADMIN', 'MANAGER'), async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.saleReturn.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Record not found');
  await prisma.$transaction(async (tx) => {
    await tx.saleReturn.update({ where: { id }, data: { isVoided: true } });
    await logAudit(tx, req.userId!, 'VOID', 'sale_returns', id, existing as any);
  });
  res.json({ success: true });
});
