import { Router } from 'express';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate, AuthRequest, requireRole } from '../../common/auth.middleware';
import { logAudit } from '../../common/audit';
import Decimal from 'decimal.js';

export const returnsRouter = Router();
returnsRouter.use(authenticate);

function computeTotals(row: { quantity: any; unitPrice: any; discountAmount: any; carriageAmount: any; taxPercent: any }) {
  const qty = new Decimal(row.quantity.toString());
  const price = new Decimal(row.unitPrice.toString());
  const discount = new Decimal(row.discountAmount?.toString() ?? '0');
  const carriage = new Decimal(row.carriageAmount?.toString() ?? '0');
  const taxPct = new Decimal(row.taxPercent?.toString() ?? '0');
  const baseValue = qty.mul(price).minus(discount).plus(carriage);
  const taxAmount = baseValue.mul(taxPct).div(100);
  const grandTotal = baseValue.plus(taxAmount);
  return {
    value: baseValue.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    grandTotal: grandTotal.toFixed(2),
  };
}

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
  const enriched = rows.map((r) => ({ ...r, ...computeTotals(r) }));
  res.json(enriched);
});

returnsRouter.post('/', async (req: AuthRequest, res) => {
  const { date, itemId, quantity, unitPrice, partyId, remarks, fyYear,
    carriageAmount = 0, taxPercent = 0, discountAmount = 0, gstType = 'IGST' } = req.body;
  if (!date || !itemId || quantity == null || unitPrice == null || !partyId || !fyYear) {
    throw new AppError(400, 'date, itemId, quantity, unitPrice, partyId, fyYear required');
  }
  const row = await prisma.$transaction(async (tx) => {
    const r = await tx.saleReturn.create({
      data: {
        date: new Date(date), itemId: Number(itemId), quantity, unitPrice,
        carriageAmount, taxPercent, discountAmount, gstType,
        partyId: Number(partyId), remarks, fyYear, createdBy: req.userId,
      },
    });
    await logAudit(tx, req.userId!, 'CREATE', 'sale_returns', r.id, undefined, r as any);
    return r;
  });
  res.status(201).json({ ...row, ...computeTotals(row) });
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
