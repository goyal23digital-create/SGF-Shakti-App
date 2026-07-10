import { Router } from 'express';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate, AuthRequest, requireRole } from '../../common/auth.middleware';
import { logAudit } from '../../common/audit';

export const paymentsRouter = Router();
paymentsRouter.use(authenticate);

paymentsRouter.get('/', async (req, res) => {
  const { fyYear, partyId, from, to } = req.query;
  const rows = await prisma.partyPayment.findMany({
    where: {
      isVoided: false,
      ...(fyYear ? { fyYear: String(fyYear) } : {}),
      ...(partyId ? { partyId: Number(partyId) } : {}),
      ...(from || to ? { date: { ...(from ? { gte: new Date(String(from)) } : {}), ...(to ? { lte: new Date(String(to)) } : {}) } } : {}),
    },
    include: { party: { select: { name: true, city: true } } },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  });
  res.json(rows);
});

paymentsRouter.post('/', async (req: AuthRequest, res) => {
  const { date, partyId, amount, paymentMode, remarks, fyYear } = req.body;
  if (!date || !partyId || amount == null || !fyYear) throw new AppError(400, 'date, partyId, amount, fyYear required');

  const party = await prisma.party.findUnique({ where: { id: Number(partyId) } });
  if (!party) throw new AppError(404, 'Party not found');

  const row = await prisma.$transaction(async (tx) => {
    const r = await tx.partyPayment.create({
      data: { date: new Date(date), partyId: Number(partyId), amount, paymentMode: paymentMode ?? 'CASH', remarks, fyYear, createdBy: req.userId },
    });
    await logAudit(tx, req.userId!, 'CREATE', 'party_payments', r.id, undefined, r as any);
    return r;
  });
  res.status(201).json(row);
});

paymentsRouter.put('/:id', async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.partyPayment.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Record not found');
  if (existing.isVoided) throw new AppError(400, 'Record is voided');

  const { date, partyId, amount, paymentMode, remarks, fyYear } = req.body;
  if (amount != null && Number(amount) < 0) throw new AppError(400, 'amount must be non-negative');

  if (partyId) {
    const party = await prisma.party.findUnique({ where: { id: Number(partyId) } });
    if (!party) throw new AppError(404, 'Party not found');
  }

  const updated = await prisma.$transaction(async (tx) => {
    const r = await tx.partyPayment.update({
      where: { id },
      data: {
        ...(date ? { date: new Date(date) } : {}),
        ...(partyId ? { partyId: Number(partyId) } : {}),
        ...(amount != null ? { amount } : {}),
        ...(paymentMode ? { paymentMode } : {}),
        ...(remarks !== undefined ? { remarks } : {}),
        ...(fyYear ? { fyYear } : {}),
      },
      include: { party: { select: { name: true, city: true } } },
    });
    await logAudit(tx, req.userId!, 'UPDATE', 'party_payments', id, existing as any, r as any);
    return r;
  });
  res.json(updated);
});

paymentsRouter.delete('/:id', requireRole('ADMIN', 'MANAGER'), async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.partyPayment.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Record not found');
  await prisma.$transaction(async (tx) => {
    await tx.partyPayment.update({ where: { id }, data: { isVoided: true } });
    await logAudit(tx, req.userId!, 'VOID', 'party_payments', id, existing as any);
  });
  res.json({ success: true });
});
