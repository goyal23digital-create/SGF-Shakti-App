import { PrismaClient } from '@prisma/client';
import { runDemoSeed } from './seedData';

const prisma = new PrismaClient();

async function main() {
  const result = await runDemoSeed(prisma);
  console.log(result.message);
}

main().catch(console.error).finally(() => prisma.$disconnect());
