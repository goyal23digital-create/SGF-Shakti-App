import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hash = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@sgf.com' },
    create: { email: 'admin@sgf.com', name: 'Admin', passwordHash: hash, role: 'ADMIN' },
    update: {},
  });

  // Sample items from the workbook
  const items = [
    { code: '9L', name: '9955 Liner' },
    { code: '8C', name: '8855 Comfy' },
    { code: 'JDC', name: 'Jordan Cut' },
    { code: 'JDS', name: 'Jordan Square' },
    { code: 'JPM', name: 'Jordan Premium' },
    { code: 'RD', name: 'Regular Design' },
    { code: 'HB', name: 'Heavy Base' },
    { code: 'SL', name: 'Standard Liner' },
  ];
  for (const item of items) {
    await prisma.item.upsert({ where: { code: item.code }, create: item, update: {} });
  }

  // Expense categories
  const cats = ['Labour', 'Electricity', 'Machinery', 'Security', 'Transport', 'Office', 'Miscellaneous'];
  for (const name of cats) {
    await prisma.expenseCategory.upsert({ where: { name }, create: { name }, update: {} });
  }

  console.log('Seed complete. Login: admin@sgf.com / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
