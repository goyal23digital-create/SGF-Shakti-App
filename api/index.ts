// Vercel serverless entry point — wraps the Express app
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorHandler } from '../backend/src/common/errorHandler';
import { authRouter } from '../backend/src/modules/auth/auth.router';
import { itemsRouter } from '../backend/src/modules/items/items.router';
import { partiesRouter } from '../backend/src/modules/parties/parties.router';
import { inventoryRouter } from '../backend/src/modules/inventory/inventory.router';
import { salesRouter } from '../backend/src/modules/sales/sales.router';
import { returnsRouter } from '../backend/src/modules/returns/returns.router';
import { paymentsRouter } from '../backend/src/modules/payments/payments.router';
import { expensesRouter } from '../backend/src/modules/expenses/expenses.router';
import { reportsRouter } from '../backend/src/modules/reports/reports.router';
import { settingsRouter } from '../backend/src/modules/settings/settings.router';
import { bootstrapMiddleware } from '../backend/src/common/bootstrap';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '4mb' }));
app.use(bootstrapMiddleware);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/parties', partiesRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/sales', salesRouter);
app.use('/api/returns', returnsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/settings', settingsRouter);

app.use(errorHandler);

export default app;
