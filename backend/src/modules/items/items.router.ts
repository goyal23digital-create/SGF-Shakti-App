import { Router } from 'express';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate, requireRole } from '../../common/auth.middleware';

export const itemsRouter = Router();
itemsRouter.use(authenticate);

itemsRouter.get('/', async (_req, res) => {
  const items = await prisma.item.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
  res.json(items);
});

itemsRouter.get('/:id', async (req, res) => {
  const item = await prisma.item.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) throw new AppError(404, 'Item not found');
  res.json(item);
});

itemsRouter.post('/', requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  const { code, name, avgHourlyProduction, maxHourlyProduction, avgWeight, withFlashWeight, maxWeight } = req.body;
  if (!code || !name) throw new AppError(400, 'code and name required');

  const item = await prisma.item.create({
    data: { code, name, avgHourlyProduction, maxHourlyProduction, avgWeight, withFlashWeight, maxWeight },
  });
  res.status(201).json(item);
});

itemsRouter.put('/:id', requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  const { code, name, avgHourlyProduction, maxHourlyProduction, avgWeight, withFlashWeight, maxWeight, isActive } = req.body;
  const item = await prisma.item.update({
    where: { id: Number(req.params.id) },
    data: { code, name, avgHourlyProduction, maxHourlyProduction, avgWeight, withFlashWeight, maxWeight, isActive },
  });
  res.json(item);
});

itemsRouter.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  await prisma.item.update({ where: { id: Number(req.params.id) }, data: { isActive: false } });
  res.json({ success: true });
});
