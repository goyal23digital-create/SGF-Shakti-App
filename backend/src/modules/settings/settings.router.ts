import { Router } from 'express';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate, AuthRequest, requireRole } from '../../common/auth.middleware';
import { logAudit } from '../../common/audit';
import { runDemoSeed } from '../../prisma/seedData';

export const settingsRouter = Router();

const GST_TYPES = ['IGST', 'CGST+SGST', 'NONE'];
const MAX_LOGO_CHARS = 2_000_000;

// PUBLIC — returns the singleton, creating it with defaults if missing.
settingsRouter.get('/', async (_req, res) => {
  const settings = await prisma.companySettings.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });
  res.json(settings);
});

settingsRouter.put('/', authenticate, requireRole('ADMIN', 'MANAGER'), async (req: AuthRequest, res) => {
  const {
    companyName, tagline, logoDataUri, gstin, stateCode, address, phone, email,
    defaultTaxPercent, defaultGstType, accentColor, lowStockThreshold, invoicePrefix,
  } = req.body ?? {};

  if (logoDataUri !== undefined && logoDataUri !== null) {
    if (typeof logoDataUri !== 'string' || !logoDataUri.startsWith('data:image/')) {
      throw new AppError(400, 'logoDataUri must be a data:image/ URI or null');
    }
    if (logoDataUri.length > MAX_LOGO_CHARS) {
      throw new AppError(413, `logoDataUri too large (max ${MAX_LOGO_CHARS} characters)`);
    }
  }
  if (defaultGstType !== undefined && !GST_TYPES.includes(defaultGstType)) {
    throw new AppError(400, `defaultGstType must be one of ${GST_TYPES.join(', ')}`);
  }
  if (defaultTaxPercent !== undefined) {
    const pct = Number(defaultTaxPercent);
    if (Number.isNaN(pct) || pct < 0 || pct > 28) {
      throw new AppError(400, 'defaultTaxPercent must be between 0 and 28');
    }
  }
  if (lowStockThreshold !== undefined) {
    const n = Number(lowStockThreshold);
    if (!Number.isInteger(n) || n < 0) {
      throw new AppError(400, 'lowStockThreshold must be a non-negative integer');
    }
  }

  const data = {
    ...(companyName !== undefined ? { companyName } : {}),
    ...(tagline !== undefined ? { tagline } : {}),
    ...(logoDataUri !== undefined ? { logoDataUri } : {}),
    ...(gstin !== undefined ? { gstin } : {}),
    ...(stateCode !== undefined ? { stateCode } : {}),
    ...(address !== undefined ? { address } : {}),
    ...(phone !== undefined ? { phone } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(defaultTaxPercent !== undefined ? { defaultTaxPercent } : {}),
    ...(defaultGstType !== undefined ? { defaultGstType } : {}),
    ...(accentColor !== undefined ? { accentColor } : {}),
    ...(lowStockThreshold !== undefined ? { lowStockThreshold: Number(lowStockThreshold) } : {}),
    ...(invoicePrefix !== undefined ? { invoicePrefix } : {}),
  };

  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.companySettings.findUnique({ where: { id: 1 } });
    const r = await tx.companySettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });
    await logAudit(tx, req.userId!, 'UPDATE', 'company_settings', 1, existing ?? undefined, r as any);
    return r;
  });
  res.json(updated);
});

settingsRouter.post('/seed-demo', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res) => {
  const result = await runDemoSeed(prisma);
  res.json(result);
});
