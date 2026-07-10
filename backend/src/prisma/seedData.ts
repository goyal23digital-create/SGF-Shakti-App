import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export interface DemoSeedResult {
  seeded: boolean;
  message: string;
}

/**
 * Seeds the demo dataset. No-ops (returns seeded:false) when any items already exist.
 * The admin user (admin@sgf.com / admin123) is created only when no users exist at all.
 */
export async function runDemoSeed(prisma: PrismaClient): Promise<DemoSeedResult> {
  const itemCount = await prisma.item.count();
  if (itemCount > 0) {
    return { seeded: false, message: 'Demo data skipped: items already exist.' };
  }

  // ── Admin user (only if no users exist) ──────────────────────────────────────
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const hash = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: { email: 'admin@sgf.com', name: 'Admin', passwordHash: hash, role: 'ADMIN' },
    });
  }
  const admin =
    (await prisma.user.findUnique({ where: { email: 'admin@sgf.com' } })) ??
    (await prisma.user.findFirst({ where: { role: 'ADMIN' } })) ??
    (await prisma.user.findFirst());
  const adminId = admin?.id;

  // ── Items ─────────────────────────────────────────────────────────────────────
  const itemDefs = [
    { code: '9L',  name: '9955 Liner',      avgWeight: 9.5 },
    { code: '8C',  name: '8855 Comfy',      avgWeight: 8.8 },
    { code: 'JDC', name: 'Jordan Cut',      avgWeight: 10.2 },
    { code: 'JDS', name: 'Jordan Square',   avgWeight: 10.0 },
    { code: 'JPM', name: 'Jordan Premium',  avgWeight: 11.5 },
    { code: 'RD',  name: 'Regular Design',  avgWeight: 8.0 },
    { code: 'HB',  name: 'Heavy Base',      avgWeight: 12.0 },
    { code: 'SL',  name: 'Standard Liner',  avgWeight: 7.5 },
    { code: 'DLX', name: 'Deluxe Series',   avgWeight: 13.0 },
    { code: 'ECO', name: 'Economy Range',   avgWeight: 6.5 },
  ];

  const itemMap: Record<string, number> = {};
  for (const item of itemDefs) {
    const r = await prisma.item.upsert({
      where: { code: item.code },
      create: { code: item.code, name: item.name, avgWeight: item.avgWeight },
      update: { name: item.name, avgWeight: item.avgWeight },
    });
    itemMap[item.code] = r.id;
  }

  // ── Expense categories ────────────────────────────────────────────────────────
  const cats = ['Labour', 'Electricity', 'Machinery', 'Security', 'Transport', 'Office', 'Miscellaneous'];
  const catMap: Record<string, number> = {};
  for (const name of cats) {
    const c = await prisma.expenseCategory.upsert({ where: { name }, create: { name }, update: {} });
    catMap[name] = c.id;
  }

  // ── Parties ───────────────────────────────────────────────────────────────────
  const partyDefs = [
    { name: 'Akal Sahai Furniture',      city: 'Ludhiana',    phone: '9876500001', gstin: '03ABCDE1234F1Z5', stateCode: '03' },
    { name: 'Asian Steels',              city: 'Bikaner',     phone: '9876500002', gstin: '08FGHIJ5678G2Z6', stateCode: '08' },
    { name: 'High Point Furniture',      city: 'Jammu',       phone: '9876500003', gstin: '01KLMNO9012H3Z7', stateCode: '01' },
    { name: 'Balaji Furniture House',    city: 'Jaipur',      phone: '9876500004', gstin: '08PQRST3456I4Z8', stateCode: '08' },
    { name: 'Punjab Steel Works',        city: 'Amritsar',    phone: '9876500005', gstin: '03UVWXY7890J5Z9', stateCode: '03' },
    { name: 'Himachal Furniture Depot',  city: 'Shimla',      phone: '9876500006', gstin: '02ABCIJ1234K6Z0', stateCode: '02' },
    { name: 'Raj Furniture',             city: 'Delhi',       phone: '9876500007', gstin: '07DEFKL5678L7Z1', stateCode: '07' },
    { name: 'Northern Steel Traders',    city: 'Chandigarh',  phone: '9876500008', gstin: '04GHIMN9012M8Z2', stateCode: '04' },
  ];

  const partyMap: Record<string, number> = {};
  for (const p of partyDefs) {
    const r = await prisma.party.upsert({
      where: { name: p.name },
      create: p,
      update: { city: p.city, phone: p.phone, gstin: p.gstin, stateCode: p.stateCode },
    });
    partyMap[p.name] = r.id;
  }

  // ── Party rates ───────────────────────────────────────────────────────────────
  const rateDefs: Array<{ party: string; item: string; rate: number }> = [
    { party: 'Akal Sahai Furniture',     item: '9L',  rate: 320 },
    { party: 'Akal Sahai Furniture',     item: '8C',  rate: 290 },
    { party: 'Akal Sahai Furniture',     item: 'JDC', rate: 380 },
    { party: 'Akal Sahai Furniture',     item: 'HB',  rate: 420 },
    { party: 'Asian Steels',             item: '9L',  rate: 315 },
    { party: 'Asian Steels',             item: 'JDS', rate: 370 },
    { party: 'Asian Steels',             item: 'JPM', rate: 450 },
    { party: 'Asian Steels',             item: 'ECO', rate: 180 },
    { party: 'High Point Furniture',     item: '8C',  rate: 285 },
    { party: 'High Point Furniture',     item: 'JDC', rate: 375 },
    { party: 'High Point Furniture',     item: 'DLX', rate: 490 },
    { party: 'High Point Furniture',     item: 'SL',  rate: 220 },
    { party: 'Balaji Furniture House',   item: '9L',  rate: 310 },
    { party: 'Balaji Furniture House',   item: 'RD',  rate: 260 },
    { party: 'Balaji Furniture House',   item: 'ECO', rate: 175 },
    { party: 'Balaji Furniture House',   item: 'JPM', rate: 445 },
    { party: 'Punjab Steel Works',       item: '9L',  rate: 325 },
    { party: 'Punjab Steel Works',       item: '8C',  rate: 295 },
    { party: 'Punjab Steel Works',       item: 'HB',  rate: 415 },
    { party: 'Punjab Steel Works',       item: 'SL',  rate: 215 },
    { party: 'Himachal Furniture Depot', item: 'JDC', rate: 385 },
    { party: 'Himachal Furniture Depot', item: 'JDS', rate: 365 },
    { party: 'Himachal Furniture Depot', item: 'DLX', rate: 495 },
    { party: 'Raj Furniture',            item: '9L',  rate: 330 },
    { party: 'Raj Furniture',            item: 'JPM', rate: 460 },
    { party: 'Raj Furniture',            item: 'DLX', rate: 500 },
    { party: 'Raj Furniture',            item: 'RD',  rate: 265 },
    { party: 'Northern Steel Traders',   item: '8C',  rate: 288 },
    { party: 'Northern Steel Traders',   item: 'JDC', rate: 378 },
    { party: 'Northern Steel Traders',   item: 'ECO', rate: 172 },
    { party: 'Northern Steel Traders',   item: 'SL',  rate: 218 },
  ];

  for (const rd of rateDefs) {
    const partyId = partyMap[rd.party];
    const itemId  = itemMap[rd.item];
    if (!partyId || !itemId) continue;
    await prisma.partyItemRate.upsert({
      where: { partyId_itemId: { partyId, itemId } },
      create: { partyId, itemId, rate: rd.rate },
      update: { rate: rd.rate },
    });
  }

  // ── Inventory (production) ────────────────────────────────────────────────────
  const inventoryDefs = [
    { daysBack: 85, item: '9L',  qty: 150 },
    { daysBack: 82, item: '8C',  qty: 120 },
    { daysBack: 79, item: 'JDC', qty: 80  },
    { daysBack: 75, item: 'JDS', qty: 100 },
    { daysBack: 72, item: 'JPM', qty: 60  },
    { daysBack: 68, item: 'RD',  qty: 200 },
    { daysBack: 65, item: 'HB',  qty: 75  },
    { daysBack: 61, item: 'SL',  qty: 180 },
    { daysBack: 58, item: 'DLX', qty: 50  },
    { daysBack: 55, item: 'ECO', qty: 160 },
    { daysBack: 50, item: '9L',  qty: 130 },
    { daysBack: 47, item: '8C',  qty: 110 },
    { daysBack: 43, item: 'JDC', qty: 90  },
    { daysBack: 40, item: 'HB',  qty: 65  },
    { daysBack: 36, item: 'JPM', qty: 55  },
    { daysBack: 32, item: 'RD',  qty: 170 },
    { daysBack: 28, item: 'SL',  qty: 140 },
    { daysBack: 24, item: 'ECO', qty: 120 },
    { daysBack: 18, item: '9L',  qty: 100 },
    { daysBack: 12, item: 'DLX', qty: 45  },
  ];

  for (const inv of inventoryDefs) {
    await prisma.inventoryIn.create({
      data: {
        date: daysAgo(inv.daysBack),
        itemId: itemMap[inv.item],
        quantity: inv.qty,
        type: 'PRODUCTION',
        fyYear: '2026-27',
        createdBy: adminId,
      },
    });
  }

  // ── Sales ─────────────────────────────────────────────────────────────────────
  const salesDefs = [
    { daysBack: 83, party: 'Akal Sahai Furniture',     item: '9L',  qty: 50, price: 320, discount: 0,    carriage: 500,  tax: 18, gst: 'IGST' },
    { daysBack: 80, party: 'Asian Steels',             item: '9L',  qty: 40, price: 315, discount: 200,  carriage: 400,  tax: 18, gst: 'IGST' },
    { daysBack: 78, party: 'High Point Furniture',     item: '8C',  qty: 30, price: 285, discount: 0,    carriage: 300,  tax: 18, gst: 'IGST' },
    { daysBack: 75, party: 'Balaji Furniture House',   item: 'RD',  qty: 60, price: 260, discount: 500,  carriage: 600,  tax: 18, gst: 'IGST' },
    { daysBack: 72, party: 'Punjab Steel Works',       item: '8C',  qty: 35, price: 295, discount: 0,    carriage: 350,  tax: 18, gst: 'IGST' },
    { daysBack: 70, party: 'Raj Furniture',            item: '9L',  qty: 45, price: 330, discount: 300,  carriage: 450,  tax: 18, gst: 'IGST' },
    { daysBack: 67, party: 'Northern Steel Traders',   item: '8C',  qty: 25, price: 288, discount: 0,    carriage: 250,  tax: 18, gst: 'IGST' },
    { daysBack: 64, party: 'Himachal Furniture Depot', item: 'JDC', qty: 20, price: 385, discount: 100,  carriage: 800,  tax: 18, gst: 'IGST' },
    { daysBack: 61, party: 'Akal Sahai Furniture',     item: 'JDC', qty: 30, price: 380, discount: 0,    carriage: 600,  tax: 18, gst: 'IGST' },
    { daysBack: 58, party: 'Asian Steels',             item: 'JPM', qty: 15, price: 450, discount: 200,  carriage: 1000, tax: 18, gst: 'IGST' },
    { daysBack: 55, party: 'Balaji Furniture House',   item: 'ECO', qty: 80, price: 175, discount: 0,    carriage: 500,  tax: 12, gst: 'IGST' },
    { daysBack: 52, party: 'Punjab Steel Works',       item: 'HB',  qty: 20, price: 415, discount: 0,    carriage: 700,  tax: 18, gst: 'IGST' },
    { daysBack: 49, party: 'Raj Furniture',            item: 'JPM', qty: 10, price: 460, discount: 0,    carriage: 800,  tax: 18, gst: 'IGST' },
    { daysBack: 46, party: 'High Point Furniture',     item: 'DLX', qty: 12, price: 490, discount: 300,  carriage: 1200, tax: 18, gst: 'CGST+SGST' },
    { daysBack: 43, party: 'Northern Steel Traders',   item: 'JDC', qty: 18, price: 378, discount: 0,    carriage: 500,  tax: 18, gst: 'IGST' },
    { daysBack: 40, party: 'Akal Sahai Furniture',     item: 'HB',  qty: 25, price: 420, discount: 500,  carriage: 600,  tax: 18, gst: 'IGST' },
    { daysBack: 37, party: 'Asian Steels',             item: 'JDS', qty: 22, price: 370, discount: 0,    carriage: 400,  tax: 18, gst: 'IGST' },
    { daysBack: 34, party: 'Himachal Furniture Depot', item: 'JDS', qty: 28, price: 365, discount: 200,  carriage: 700,  tax: 18, gst: 'IGST' },
    { daysBack: 31, party: 'Balaji Furniture House',   item: 'JPM', qty: 8,  price: 445, discount: 0,    carriage: 600,  tax: 18, gst: 'IGST' },
    { daysBack: 28, party: 'Punjab Steel Works',       item: 'SL',  qty: 50, price: 215, discount: 0,    carriage: 400,  tax: 12, gst: 'IGST' },
    { daysBack: 25, party: 'Raj Furniture',            item: 'DLX', qty: 10, price: 500, discount: 500,  carriage: 1000, tax: 18, gst: 'CGST+SGST' },
    { daysBack: 22, party: 'Northern Steel Traders',   item: 'SL',  qty: 40, price: 218, discount: 0,    carriage: 350,  tax: 12, gst: 'IGST' },
    { daysBack: 19, party: 'Akal Sahai Furniture',     item: '9L',  qty: 35, price: 320, discount: 0,    carriage: 350,  tax: 18, gst: 'IGST' },
    { daysBack: 16, party: 'High Point Furniture',     item: 'JDC', qty: 15, price: 375, discount: 100,  carriage: 500,  tax: 18, gst: 'IGST' },
    { daysBack: 14, party: 'Asian Steels',             item: 'ECO', qty: 70, price: 180, discount: 0,    carriage: 400,  tax: 12, gst: 'IGST' },
    { daysBack: 11, party: 'Balaji Furniture House',   item: '9L',  qty: 30, price: 310, discount: 0,    carriage: 300,  tax: 18, gst: 'IGST' },
    { daysBack: 9,  party: 'Raj Furniture',            item: 'RD',  qty: 45, price: 265, discount: 200,  carriage: 450,  tax: 18, gst: 'CGST+SGST' },
    { daysBack: 7,  party: 'Punjab Steel Works',       item: '9L',  qty: 40, price: 325, discount: 0,    carriage: 400,  tax: 18, gst: 'IGST' },
    { daysBack: 5,  party: 'Northern Steel Traders',   item: '8C',  qty: 20, price: 288, discount: 0,    carriage: 200,  tax: 18, gst: 'IGST' },
    { daysBack: 3,  party: 'Himachal Furniture Depot', item: 'DLX', qty: 8,  price: 495, discount: 0,    carriage: 1000, tax: 18, gst: 'IGST' },
  ];

  for (const s of salesDefs) {
    await prisma.sale.create({
      data: {
        date: daysAgo(s.daysBack),
        itemId: itemMap[s.item],
        quantity: s.qty,
        unitPrice: s.price,
        discountAmount: s.discount,
        carriageAmount: s.carriage,
        taxPercent: s.tax,
        gstType: s.gst,
        partyId: partyMap[s.party],
        fyYear: '2026-27',
        createdBy: adminId,
      },
    });
  }

  // ── Sale returns ──────────────────────────────────────────────────────────────
  const returnDefs = [
    { daysBack: 60, party: 'Asian Steels',           item: '9L',  qty: 5, price: 315, tax: 18, gst: 'IGST', remarks: 'Defective pieces' },
    { daysBack: 45, party: 'Balaji Furniture House', item: 'RD',  qty: 8, price: 260, tax: 18, gst: 'IGST', remarks: 'Wrong model sent' },
    { daysBack: 30, party: 'High Point Furniture',   item: '8C',  qty: 3, price: 285, tax: 18, gst: 'IGST', remarks: 'Customer complaint' },
    { daysBack: 15, party: 'Raj Furniture',          item: '9L',  qty: 6, price: 330, tax: 18, gst: 'CGST+SGST', remarks: '' },
  ];

  for (const r of returnDefs) {
    await prisma.saleReturn.create({
      data: {
        date: daysAgo(r.daysBack),
        itemId: itemMap[r.item],
        quantity: r.qty,
        unitPrice: r.price,
        taxPercent: r.tax,
        gstType: r.gst,
        partyId: partyMap[r.party],
        remarks: r.remarks,
        fyYear: '2026-27',
        createdBy: adminId,
      },
    });
  }

  // ── Payments ──────────────────────────────────────────────────────────────────
  const paymentDefs = [
    { daysBack: 70, party: 'Akal Sahai Furniture',     amount: 50000,  mode: 'BANK',  remarks: 'NEFT transfer' },
    { daysBack: 65, party: 'Asian Steels',             amount: 40000,  mode: 'BANK',  remarks: '' },
    { daysBack: 60, party: 'High Point Furniture',     amount: 30000,  mode: 'CASH',  remarks: 'Cash payment' },
    { daysBack: 50, party: 'Balaji Furniture House',   amount: 60000,  mode: 'BANK',  remarks: 'RTGS' },
    { daysBack: 40, party: 'Punjab Steel Works',       amount: 35000,  mode: 'BANK',  remarks: '' },
    { daysBack: 30, party: 'Raj Furniture',            amount: 80000,  mode: 'BANK',  remarks: 'Part payment' },
    { daysBack: 20, party: 'Northern Steel Traders',   amount: 25000,  mode: 'CASH',  remarks: '' },
    { daysBack: 12, party: 'Himachal Furniture Depot', amount: 45000,  mode: 'BANK',  remarks: '' },
    { daysBack: 8,  party: 'Akal Sahai Furniture',     amount: 30000,  mode: 'BANK',  remarks: 'Second instalment' },
    { daysBack: 4,  party: 'Balaji Furniture House',   amount: 20000,  mode: 'CASH',  remarks: '' },
  ];

  for (const p of paymentDefs) {
    await prisma.partyPayment.create({
      data: {
        date: daysAgo(p.daysBack),
        partyId: partyMap[p.party],
        amount: p.amount,
        paymentMode: p.mode as any,
        remarks: p.remarks,
        fyYear: '2026-27',
        createdBy: adminId,
      },
    });
  }

  // ── Expenses ──────────────────────────────────────────────────────────────────
  const expenseDefs = [
    { daysBack: 80, payee: 'Ramesh Labour',     cat: 'Labour',        amount: 15000, mode: 'CASH', remarks: 'Monthly wages' },
    { daysBack: 75, payee: 'PSPCL',             cat: 'Electricity',   amount: 8500,  mode: 'BANK', remarks: 'Electric bill' },
    { daysBack: 60, payee: 'Security Agency',   cat: 'Security',      amount: 5000,  mode: 'CASH', remarks: '' },
    { daysBack: 50, payee: 'Truck Hire',        cat: 'Transport',     amount: 12000, mode: 'CASH', remarks: 'Dispatch to Delhi' },
    { daysBack: 40, payee: 'Ramesh Labour',     cat: 'Labour',        amount: 15000, mode: 'CASH', remarks: 'Monthly wages' },
    { daysBack: 30, payee: 'PSPCL',             cat: 'Electricity',   amount: 9200,  mode: 'BANK', remarks: '' },
    { daysBack: 20, payee: 'Office Supplies',   cat: 'Office',        amount: 2500,  mode: 'CASH', remarks: 'Stationery' },
    { daysBack: 10, payee: 'Misc Repairs',      cat: 'Miscellaneous', amount: 3800,  mode: 'CASH', remarks: 'Machine repair' },
  ];

  for (const e of expenseDefs) {
    await prisma.expense.create({
      data: {
        date: daysAgo(e.daysBack),
        payee: e.payee,
        categoryId: catMap[e.cat],
        amount: e.amount,
        paymentMode: e.mode as any,
        remarks: e.remarks,
        fyYear: '2026-27',
        createdBy: adminId,
      },
    });
  }

  return { seeded: true, message: 'Demo data seeded. Login: admin@sgf.com / admin123' };
}
