import { Router } from 'express';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate, requireRole } from '../../common/auth.middleware';

export const partiesRouter = Router();
partiesRouter.use(authenticate);

partiesRouter.get('/', async (_req, res) => {
  const parties = await prisma.party.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  res.json(parties);
});

partiesRouter.get('/:id', async (req, res) => {
  const party = await prisma.party.findUnique({
    where: { id: Number(req.params.id) },
    include: { rates: { include: { item: true } } },
  });
  if (!party) throw new AppError(404, 'Party not found');
  res.json(party);
});

partiesRouter.post('/', requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  const { name, city, phone } = req.body;
  if (!name) throw new AppError(400, 'name required');
  const party = await prisma.party.create({ data: { name, city, phone } });
  res.status(201).json(party);
});

partiesRouter.put('/:id', requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  const { name, city, phone, isActive } = req.body;
  const party = await prisma.party.update({ where: { id: Number(req.params.id) }, data: { name, city, phone, isActive } });
  res.json(party);
});

// Upsert a rate for a specific party+item pair
partiesRouter.put('/:id/rates/:itemId', requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  const partyId = Number(req.params.id);
  const itemId = Number(req.params.itemId);
  const { rate } = req.body;
  if (rate == null) throw new AppError(400, 'rate required');

  const result = await prisma.partyItemRate.upsert({
    where: { partyId_itemId: { partyId, itemId } },
    create: { partyId, itemId, rate },
    update: { rate },
  });
  res.json(result);
});

// Bulk upsert rates (for the rate matrix screen)
partiesRouter.put('/:id/rates', requireRole('ADMIN', 'MANAGER'), async (req, res) => {
  const partyId = Number(req.params.id);
  const { rates } = req.body as { rates: { itemId: number; rate: string }[] };
  if (!Array.isArray(rates)) throw new AppError(400, 'rates must be an array');

  await prisma.$transaction(
    rates.map(({ itemId, rate }) =>
      prisma.partyItemRate.upsert({
        where: { partyId_itemId: { partyId, itemId } },
        create: { partyId, itemId, rate },
        update: { rate },
      }),
    ),
  );
  res.json({ updated: rates.length });
});

// Get rate for a party+item (used on sales entry to prefill price)
partiesRouter.get('/:id/rate/:itemId', async (req, res) => {
  const rate = await prisma.partyItemRate.findUnique({
    where: { partyId_itemId: { partyId: Number(req.params.id), itemId: Number(req.params.itemId) } },
  });
  res.json(rate ?? { rate: null });
});
