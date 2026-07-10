import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new AppError(401, 'Unauthorized');
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: number; role: string };
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      throw new AppError(403, 'Forbidden');
    }
    next();
  };
}
