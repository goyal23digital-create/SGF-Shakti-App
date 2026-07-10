import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { runDemoSeed } from '../prisma/seedData';

let bootstrapPromise: Promise<void> | null = null;

async function doBootstrap(): Promise<void> {
  try {
    // (a) Ensure the CompanySettings singleton exists.
    await prisma.companySettings.upsert({
      where: { id: 1 },
      create: { id: 1 },
      update: {},
    });

    // (b) Ensure at least one user exists (admin@sgf.com / admin123).
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const hash = await bcrypt.hash('admin123', 12);
      await prisma.user.create({
        data: { email: 'admin@sgf.com', name: 'Admin', passwordHash: hash, role: 'ADMIN' },
      });
    }

    // (c) Seed demo data (no-ops when items already exist).
    await runDemoSeed(prisma);
  } catch (err) {
    // Never crash the process on bootstrap failure — log and continue.
    console.error('Bootstrap failed:', err);
  }
}

/** Runs bootstrap at most once per process (module-level promise guard). */
export async function ensureBootstrap(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = doBootstrap();
  return bootstrapPromise;
}

/** Express middleware: awaits bootstrap, then continues. Never blocks a request on failure. */
export const bootstrapMiddleware: RequestHandler = async (_req, _res, next) => {
  try {
    await ensureBootstrap();
  } catch (err) {
    console.error('Bootstrap middleware error:', err);
  }
  next();
};
