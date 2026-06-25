import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../common/prisma';
import { AppError } from '../../common/errorHandler';
import { authenticate, AuthRequest } from '../../common/auth.middleware';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError(400, 'Email and password required');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) throw new AppError(401, 'Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError(401, 'Invalid credentials');

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

authRouter.get('/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json(user);
});

authRouter.post('/register', async (req, res) => {
  const { email, name, password, role } = req.body;
  if (!email || !name || !password) throw new AppError(400, 'Missing required fields');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, passwordHash, role: role ?? 'OPERATOR' },
    select: { id: true, name: true, email: true, role: true },
  });
  res.status(201).json(user);
});
