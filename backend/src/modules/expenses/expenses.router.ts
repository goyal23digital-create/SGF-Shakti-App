import { Router } from 'express';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate, AuthRequest, requireRole } from '../../common/auth.middleware';
import { logAudit } from '../../common/audit';

export const expensesRouter = Router();
expensesRouter.use(authenticate);

expensesRouter.get('/categories', async (_req, res) => {
  const cats = await prisma.expenseCategory.findMany({ orderBy: { name: 'asc' } });
  res.json(cats);
});

expensesRouter.get('/', async (req, res) => {
  const { fyYear, categoryId, from, to } = req.query;
  const rows = await prisma.expense.findMany({
    where: {
      isVoided: false,
      ...(fyYear ? { fyYear: String(fyYear) } : {}),
      ...(categoryId ? { categoryId: Number(categoryId) } : {}),
      ...(from || to ? { date: { ...(from ? { gte: new Date(String(from)) } : {}), ...(to ? { lte: new Date(String(to)) } : {}) } } : {}),
    },
    include: { category: true },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  });
  res.json(rows);
});

expensesRouter.post('/', async (req: AuthRequest, res) => {
  const { date, payee, categoryId, amount, paymentMode, remarks, fyYear } = req.body;
  if (!date || !payee || amount == null || !fyYear) throw new AppError(400, 'date, payee, amount, fyYear required');
  if (Number(amount) < 0) throw new AppError(400, 'amount must be non-negative');

  const row = await prisma.$transaction(async (tx) => {
    const r = await tx.expense.create({
      data: {
        date: new Date(date),
        payee,
        categoryId: categoryId ? Number(categoryId) : undefined,
        amount,
        paymentMode: paymentMode ?? 'CASH',
        remarks,
        fyYear,
        createdBy: req.userId,
      },
    });
    await logAudit(tx, req.userId!, 'CREATE', 'expenses', r.id, undefined, r as any);
    return r;
  });
  res.status(201).json(row);
});

expensesRouter.delete('/:id', requireRole('ADMIN', 'MANAGER'), async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.expense.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Record not found');
  await prisma.$transaction(async (tx) => {
    await tx.expense.update({ where: { id }, data: { isVoided: true } });
    await logAudit(tx, req.userId!, 'VOID', 'expenses', id, existing as any);
  });
  res.json({ success: true });
});
