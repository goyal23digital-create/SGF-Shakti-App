import { Router } from 'express';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate } from '../../common/auth.middleware';
import Decimal from 'decimal.js';

export const reportsRouter = Router();
reportsRouter.use(authenticate);

function fyWhere(fyYear?: string) {
  return fyYear ? { fyYear: String(fyYear) } : {};
}
function dateRange(from?: string, to?: string) {
  if (!from && !to) return {};
  return { date: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } };
}

// ── Inventory Status ──────────────────────────────────────────────────────────
reportsRouter.get('/inventory-status', async (req, res) => {
  const { fyYear } = req.query;
  const fy = fyWhere(fyYear as string);

  const [ins, outs, returns] = await Promise.all([
    prisma.inventoryIn.groupBy({ by: ['itemId'], where: { isVoided: false, ...fy }, _sum: { quantity: true } }),
    prisma.sale.groupBy({ by: ['itemId'], where: { isVoided: false, ...fy }, _sum: { quantity: true } }),
    prisma.saleReturn.groupBy({ by: ['itemId'], where: { isVoided: false, ...fy }, _sum: { quantity: true } }),
  ]);

  const items = await prisma.item.findMany({ select: { id: true, code: true, name: true } });
  const insMap = new Map(ins.map((r) => [r.itemId, new Decimal(r._sum.quantity?.toString() ?? '0')]));
  const outsMap = new Map(outs.map((r) => [r.itemId, new Decimal(r._sum.quantity?.toString() ?? '0')]));
  const retMap = new Map(returns.map((r) => [r.itemId, new Decimal(r._sum.quantity?.toString() ?? '0')]));

  const result = items.map((item) => {
    const inQty = insMap.get(item.id) ?? new Decimal(0);
    const outQty = outsMap.get(item.id) ?? new Decimal(0);
    const retQty = retMap.get(item.id) ?? new Decimal(0);
    const onHand = inQty.minus(outQty).plus(retQty);
    return { ...item, inQty: inQty.toFixed(3), outQty: outQty.toFixed(3), returnQty: retQty.toFixed(3), onHand: onHand.toFixed(3) };
  });
  res.json(result);
});

// ── Party Payment Tracking ─────────────────────────────────────────────────────
reportsRouter.get('/party-balances', async (req, res) => {
  const { fyYear, partyId } = req.query;
  const fy = fyWhere(fyYear as string);
  const pFilter = partyId ? { partyId: Number(partyId) } : {};

  const [sales, returns, payments, parties] = await Promise.all([
    prisma.sale.groupBy({ by: ['partyId'], where: { isVoided: false, ...fy, ...pFilter }, _sum: { quantity: true, unitPrice: true } }),
    prisma.saleReturn.groupBy({ by: ['partyId'], where: { isVoided: false, ...fy, ...pFilter }, _sum: { quantity: true, unitPrice: true } }),
    prisma.partyPayment.groupBy({ by: ['partyId'], where: { isVoided: false, ...fy, ...pFilter }, _sum: { amount: true } }),
    prisma.party.findMany({ where: { isActive: true }, select: { id: true, name: true, city: true } }),
  ]);

  // Use aggregate queries per party for value (quantity * unit_price)
  const allSales = await prisma.sale.findMany({
    where: { isVoided: false, ...fy, ...pFilter },
    select: { partyId: true, quantity: true, unitPrice: true },
  });
  const allReturns = await prisma.saleReturn.findMany({
    where: { isVoided: false, ...fy, ...pFilter },
    select: { partyId: true, quantity: true, unitPrice: true },
  });

  const salesMap = new Map<number, Decimal>();
  for (const s of allSales) {
    const v = new Decimal(s.quantity.toString()).mul(s.unitPrice.toString());
    salesMap.set(s.partyId, (salesMap.get(s.partyId) ?? new Decimal(0)).plus(v));
  }
  const retMap = new Map<number, Decimal>();
  for (const r of allReturns) {
    const v = new Decimal(r.quantity.toString()).mul(r.unitPrice.toString());
    retMap.set(r.partyId, (retMap.get(r.partyId) ?? new Decimal(0)).plus(v));
  }

  const payMap = new Map(payments.map((r) => [r.partyId, new Decimal(r._sum.amount?.toString() ?? '0')]));

  const result = parties.map((p) => {
    const totalSales = salesMap.get(p.id) ?? new Decimal(0);
    const totalReturns = retMap.get(p.id) ?? new Decimal(0);
    const totalPayments = payMap.get(p.id) ?? new Decimal(0);
    const outstanding = totalSales.minus(totalReturns).minus(totalPayments);
    return {
      ...p,
      totalSales: totalSales.toFixed(2),
      totalReturns: totalReturns.toFixed(2),
      totalPayments: totalPayments.toFixed(2),
      outstanding: outstanding.toFixed(2),
    };
  });
  res.json(result);
});

// ── Party Ledger (chronological statement) ────────────────────────────────────
reportsRouter.get('/party-ledger/:partyId', async (req, res) => {
  const partyId = Number(req.params.partyId);
  const { fyYear, from, to } = req.query;
  const party = await prisma.party.findUnique({ where: { id: partyId } });
  if (!party) throw new AppError(404, 'Party not found');

  const fy = fyWhere(fyYear as string);
  const dr = dateRange(from as string, to as string);
  const filter = { isVoided: false, partyId, ...fy, ...dr };

  const [salesRows, returnRows, paymentRows] = await Promise.all([
    prisma.sale.findMany({ where: filter, include: { item: { select: { code: true, name: true } } }, orderBy: { date: 'asc' } }),
    prisma.saleReturn.findMany({ where: filter, include: { item: { select: { code: true, name: true } } }, orderBy: { date: 'asc' } }),
    prisma.partyPayment.findMany({ where: filter, orderBy: { date: 'asc' } }),
  ]);

  const entries: { date: Date; type: string; description: string; debit: string; credit: string }[] = [];

  for (const s of salesRows) {
    const value = new Decimal(s.quantity.toString()).mul(s.unitPrice.toString());
    entries.push({ date: s.date, type: 'SALE', description: `${s.item.code} - ${s.item.name} (${s.quantity} × ${s.unitPrice})`, debit: value.toFixed(2), credit: '0.00' });
  }
  for (const r of returnRows) {
    const value = new Decimal(r.quantity.toString()).mul(r.unitPrice.toString());
    entries.push({ date: r.date, type: 'RETURN', description: `${r.item.code} - ${r.item.name} (${r.quantity} × ${r.unitPrice})`, debit: '0.00', credit: value.toFixed(2) });
  }
  for (const p of paymentRows) {
    entries.push({ date: p.date, type: 'PAYMENT', description: `Payment (${p.paymentMode})${p.remarks ? ` - ${p.remarks}` : ''}`, debit: '0.00', credit: new Decimal(p.amount.toString()).toFixed(2) });
  }

  entries.sort((a, b) => a.date.getTime() - b.date.getTime());

  let running = new Decimal(0);
  const ledger = entries.map((e) => {
    running = running.plus(e.debit).minus(e.credit);
    return { ...e, runningBalance: running.toFixed(2) };
  });

  res.json({ party, ledger });
});

// ── Sales Analysis (by item, by party, by date) ───────────────────────────────
reportsRouter.get('/sales-analysis', async (req, res) => {
  const { fyYear, groupBy, from, to } = req.query;
  const fy = fyWhere(fyYear as string);
  const dr = dateRange(from as string, to as string);

  const rows = await prisma.sale.findMany({
    where: { isVoided: false, ...fy, ...dr },
    include: { item: { select: { code: true, name: true } }, party: { select: { name: true, city: true } } },
  });

  const grouped = new Map<string, { key: string; label: string; quantity: Decimal; value: Decimal }>();
  for (const r of rows) {
    let key: string, label: string;
    if (groupBy === 'party') { key = String(r.partyId); label = r.party.name; }
    else if (groupBy === 'date') { key = r.date.toISOString().slice(0, 10); label = key; }
    else { key = String(r.itemId); label = `${r.item.code} - ${r.item.name}`; }

    const existing = grouped.get(key) ?? { key, label, quantity: new Decimal(0), value: new Decimal(0) };
    existing.quantity = existing.quantity.plus(r.quantity.toString());
    existing.value = existing.value.plus(new Decimal(r.quantity.toString()).mul(r.unitPrice.toString()));
    grouped.set(key, existing);
  }

  res.json(
    Array.from(grouped.values()).map((r) => ({ ...r, quantity: r.quantity.toFixed(3), value: r.value.toFixed(2) })),
  );
});

// ── Expense Summary ───────────────────────────────────────────────────────────
reportsRouter.get('/expense-summary', async (req, res) => {
  const { fyYear, from, to } = req.query;
  const rows = await prisma.expense.findMany({
    where: { isVoided: false, ...fyWhere(fyYear as string), ...dateRange(from as string, to as string) },
    include: { category: true },
    orderBy: [{ date: 'asc' }],
  });

  const byCategory = new Map<string, Decimal>();
  for (const r of rows) {
    const cat = r.category?.name ?? 'Uncategorized';
    byCategory.set(cat, (byCategory.get(cat) ?? new Decimal(0)).plus(r.amount.toString()));
  }

  const summary = Array.from(byCategory.entries()).map(([category, total]) => ({ category, total: total.toFixed(2) }));
  const grandTotal = Array.from(byCategory.values()).reduce((a, b) => a.plus(b), new Decimal(0));
  res.json({ summary, grandTotal: grandTotal.toFixed(2), rows });
});

// ── Production Analysis ────────────────────────────────────────────────────────
reportsRouter.get('/production-analysis', async (req, res) => {
  const { fyYear, groupBy, from, to } = req.query;
  const rows = await prisma.inventoryIn.findMany({
    where: { isVoided: false, type: 'PRODUCTION', ...fyWhere(fyYear as string), ...dateRange(from as string, to as string) },
    include: { item: { select: { code: true, name: true } } },
  });

  const grouped = new Map<string, { key: string; label: string; quantity: Decimal }>();
  for (const r of rows) {
    let key: string, label: string;
    if (groupBy === 'date') { key = r.date.toISOString().slice(0, 10); label = key; }
    else { key = String(r.itemId); label = `${r.item.code} - ${r.item.name}`; }

    const existing = grouped.get(key) ?? { key, label, quantity: new Decimal(0) };
    existing.quantity = existing.quantity.plus(r.quantity.toString());
    grouped.set(key, existing);
  }

  res.json(Array.from(grouped.values()).map((r) => ({ ...r, quantity: r.quantity.toFixed(3) })));
});
