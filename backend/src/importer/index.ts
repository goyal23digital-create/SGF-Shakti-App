/**
 * CSV importer: reads exported tabs from the Shakti Gold Furniture workbook and
 * loads them into the database. Supports --dry-run mode for reconciliation without writes.
 *
 * Usage:
 *   ts-node src/importer/index.ts --csv-dir ./csv-exports [--dry-run] [--fy 2026-27]
 */

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import Decimal from 'decimal.js';
import { PrismaClient, InventoryInType, PaymentMode } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FY = args.find((a) => a.startsWith('--fy='))?.split('=')[1] ?? '2026-27';
const CSV_DIR = args.find((a) => a.startsWith('--csv-dir='))?.split('=')[1] ?? './csv-exports';

function readCsv(file: string): Record<string, string>[] {
  const content = fs.readFileSync(path.join(CSV_DIR, file), 'utf-8');
  const result = Papa.parse(content, { header: true, skipEmptyLines: true });
  return result.data as Record<string, string>[];
}

function parseDate(s: string): Date {
  if (!s) throw new Error(`Empty date`);
  const d = new Date(s);
  if (isNaN(d.getTime())) throw new Error(`Invalid date: ${s}`);
  return d;
}

function parseDecimal(s: string): string {
  if (!s || s.trim() === '') return '0';
  return new Decimal(s.replace(/,/g, '').trim()).toFixed(6);
}

type Stats = { inserted: number; skipped: number; errors: string[] };
function makeStats(): Stats { return { inserted: 0, skipped: 0, errors: [] }; }

async function importItems(stats: Stats) {
  console.log('Importing items (Item List)...');
  const rows = readCsv('item-list.csv');
  for (const row of rows) {
    const code = row['Code']?.trim();
    const name = row['Name']?.trim();
    if (!code || !name) { stats.skipped++; continue; }
    try {
      if (!DRY_RUN) {
        await prisma.item.upsert({
          where: { code },
          create: {
            code, name,
            avgHourlyProduction: row['Avg Hourly Production'] ? parseDecimal(row['Avg Hourly Production']) : undefined,
            maxHourlyProduction: row['Max Hourly Production'] ? parseDecimal(row['Max Hourly Production']) : undefined,
            avgWeight: row['Avg Weight'] ? parseDecimal(row['Avg Weight']) : undefined,
            withFlashWeight: row['With Flash Weight'] ? parseDecimal(row['With Flash Weight']) : undefined,
            maxWeight: row['Max Weight'] ? parseDecimal(row['Max Weight']) : undefined,
          },
          update: {},
        });
      }
      stats.inserted++;
    } catch (e: any) {
      stats.errors.push(`Item ${code}: ${e.message}`);
    }
  }
}

async function importParties(stats: Stats) {
  console.log('Importing parties and rates (Party And Rate List)...');
  const rows = readCsv('party-rate-list.csv');
  if (rows.length === 0) return;

  // First row after header identifies item codes in each column
  const headers = Object.keys(rows[0]);
  const partyCol = headers[0]; // Column A = Party name
  const itemCols = headers.slice(1);

  for (const row of rows) {
    const partyName = row[partyCol]?.trim();
    if (!partyName) { stats.skipped++; continue; }

    // Extract city from name (last word if it looks like a city)
    const parts = partyName.split(' ');
    const city = parts[parts.length - 1];

    try {
      let party: { id: number } | null = null;
      if (!DRY_RUN) {
        party = await prisma.party.upsert({
          where: { name: partyName },
          create: { name: partyName, city },
          update: {},
        });
      } else {
        party = { id: 0 }; // placeholder for dry run
      }
      stats.inserted++;

      for (const col of itemCols) {
        const rate = row[col]?.trim();
        if (!rate || rate === '0' || rate === '') continue;
        const item = await prisma.item.findUnique({ where: { code: col.trim() } });
        if (!item) continue;
        if (!DRY_RUN && party) {
          await prisma.partyItemRate.upsert({
            where: { partyId_itemId: { partyId: party.id, itemId: item.id } },
            create: { partyId: party.id, itemId: item.id, rate: parseDecimal(rate) },
            update: { rate: parseDecimal(rate) },
          });
        }
      }
    } catch (e: any) {
      stats.errors.push(`Party ${partyName}: ${e.message}`);
    }
  }
}

async function importInventoryIn(stats: Stats) {
  console.log('Importing inventory in (Inventory In)...');
  const rows = readCsv('inventory-in.csv');
  for (const row of rows) {
    const code = row['Code']?.trim();
    const dateStr = row['Date']?.trim();
    const qtyStr = row['Quantity']?.trim();
    if (!code || !dateStr || !qtyStr) { stats.skipped++; continue; }

    const remarks = row['Remarks']?.trim();
    let type: InventoryInType = 'PRODUCTION';
    if (remarks?.toLowerCase().includes('balance b/f')) type = 'OPENING';
    else if (remarks?.toLowerCase().includes('adjustment')) type = 'ADJUSTMENT';

    try {
      const item = await prisma.item.findUnique({ where: { code } });
      if (!item) { stats.errors.push(`InventoryIn: unknown item ${code}`); stats.skipped++; continue; }

      if (!DRY_RUN) {
        await prisma.inventoryIn.create({
          data: { date: parseDate(dateStr), itemId: item.id, quantity: parseDecimal(qtyStr), type, remarks, fyYear: FY },
        });
      }
      stats.inserted++;
    } catch (e: any) {
      stats.errors.push(`InventoryIn row (${dateStr} ${code}): ${e.message}`);
    }
  }
}

async function importSales(stats: Stats) {
  console.log('Importing sales (Inventory Out)...');
  const rows = readCsv('inventory-out.csv');
  for (const row of rows) {
    const code = row['Code']?.trim();
    const dateStr = row['Date']?.trim();
    const qtyStr = row['Quantity']?.trim();
    const priceStr = row['Price']?.trim();
    const partyName = row['Party']?.trim();
    if (!code || !dateStr || !qtyStr || !priceStr || !partyName) { stats.skipped++; continue; }

    try {
      const [item, party] = await Promise.all([
        prisma.item.findUnique({ where: { code } }),
        prisma.party.findFirst({ where: { name: partyName } }),
      ]);
      if (!item) { stats.errors.push(`Sales: unknown item ${code}`); stats.skipped++; continue; }
      if (!party) { stats.errors.push(`Sales: unknown party ${partyName}`); stats.skipped++; continue; }

      if (!DRY_RUN) {
        await prisma.sale.create({
          data: {
            date: parseDate(dateStr),
            itemId: item.id,
            quantity: parseDecimal(qtyStr),
            unitPrice: parseDecimal(priceStr),
            partyId: party.id,
            remarks: row['Remarks']?.trim(),
            fyYear: FY,
          },
        });
      }
      stats.inserted++;
    } catch (e: any) {
      stats.errors.push(`Sale row (${dateStr} ${code}): ${e.message}`);
    }
  }
}

async function importReturns(stats: Stats) {
  console.log('Importing returns (Return)...');
  const rows = readCsv('returns.csv');
  for (const row of rows) {
    const code = row['Code']?.trim();
    const dateStr = row['Date']?.trim();
    const qtyStr = row['Quantity']?.trim();
    const priceStr = row['Price']?.trim();
    const partyName = row['Party']?.trim();
    if (!code || !dateStr || !qtyStr || !priceStr || !partyName) { stats.skipped++; continue; }

    try {
      const [item, party] = await Promise.all([
        prisma.item.findUnique({ where: { code } }),
        prisma.party.findFirst({ where: { name: partyName } }),
      ]);
      if (!item || !party) { stats.skipped++; continue; }

      if (!DRY_RUN) {
        await prisma.saleReturn.create({
          data: {
            date: parseDate(dateStr),
            itemId: item.id,
            quantity: parseDecimal(qtyStr),
            unitPrice: parseDecimal(priceStr),
            partyId: party.id,
            fyYear: FY,
          },
        });
      }
      stats.inserted++;
    } catch (e: any) {
      stats.errors.push(`Return row (${dateStr} ${code}): ${e.message}`);
    }
  }
}

function parsePaymentMode(s?: string): PaymentMode {
  const v = s?.trim().toUpperCase();
  if (v === 'BANK') return 'BANK';
  if (v === 'CASH') return 'CASH';
  if (v === 'TRANSPORT') return 'TRANSPORT';
  if (v === 'B/F' || v === 'BF') return 'BF';
  return 'OTHER';
}

async function importPayments(stats: Stats) {
  console.log('Importing payments (Cash In Party Payment)...');
  const rows = readCsv('cash-in.csv');
  for (const row of rows) {
    const partyName = row['Party']?.trim();
    const dateStr = row['Date']?.trim();
    const amtStr = row['Value']?.trim();
    if (!partyName || !dateStr || !amtStr) { stats.skipped++; continue; }

    try {
      const party = await prisma.party.findFirst({ where: { name: partyName } });
      if (!party) { stats.errors.push(`Payment: unknown party ${partyName}`); stats.skipped++; continue; }

      if (!DRY_RUN) {
        await prisma.partyPayment.create({
          data: {
            date: parseDate(dateStr),
            partyId: party.id,
            amount: parseDecimal(amtStr),
            paymentMode: parsePaymentMode(row['Payment Mode']),
            remarks: row['Remarks']?.trim(),
            fyYear: FY,
          },
        });
      }
      stats.inserted++;
    } catch (e: any) {
      stats.errors.push(`Payment row (${dateStr} ${partyName}): ${e.message}`);
    }
  }
}

async function importExpenses(stats: Stats) {
  console.log('Importing expenses (Cash Out Expenses)...');
  const rows = readCsv('cash-out.csv');
  for (const row of rows) {
    const payee = row['Party']?.trim();
    const dateStr = row['Date']?.trim();
    const amtStr = row['Value']?.trim();
    if (!payee || !dateStr || !amtStr) { stats.skipped++; continue; }

    try {
      if (!DRY_RUN) {
        await prisma.expense.create({
          data: {
            date: parseDate(dateStr),
            payee,
            amount: parseDecimal(amtStr),
            paymentMode: parsePaymentMode(row['Payment Mode']),
            remarks: row['Remarks']?.trim(),
            fyYear: FY,
          },
        });
      }
      stats.inserted++;
    } catch (e: any) {
      stats.errors.push(`Expense row (${dateStr} ${payee}): ${e.message}`);
    }
  }
}

async function main() {
  console.log(`SGF Importer ${DRY_RUN ? '[DRY RUN]' : '[LIVE]'} FY=${FY} dir=${CSV_DIR}\n`);

  const allStats: Record<string, Stats> = {};

  for (const [label, fn] of [
    ['items', importItems],
    ['parties', importParties],
    ['inventory-in', importInventoryIn],
    ['sales', importSales],
    ['returns', importReturns],
    ['payments', importPayments],
    ['expenses', importExpenses],
  ] as [string, (s: Stats) => Promise<void>][]) {
    const s = makeStats();
    await fn(s);
    allStats[label] = s;
    console.log(`  ${label}: +${s.inserted} skipped=${s.skipped} errors=${s.errors.length}`);
    if (s.errors.length) s.errors.slice(0, 5).forEach((e) => console.warn('   ', e));
  }

  console.log('\nReconciliation summary:');
  for (const [label, s] of Object.entries(allStats)) {
    console.log(`  ${label.padEnd(20)} inserted=${s.inserted} skipped=${s.skipped} errors=${s.errors.length}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
