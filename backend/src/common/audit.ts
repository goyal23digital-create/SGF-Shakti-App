import { PrismaClient } from '@prisma/client';

type Action = 'CREATE' | 'UPDATE' | 'VOID';

export async function logAudit(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  userId: number,
  action: Action,
  tableName: string,
  recordId: number,
  oldValues?: object,
  newValues?: object,
) {
  await tx.auditLog.create({
    data: { userId, action, tableName, recordId, oldValues, newValues },
  });
}
