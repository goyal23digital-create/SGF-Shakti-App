import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './common/errorHandler';
import { authRouter } from './modules/auth/auth.router';
import { itemsRouter } from './modules/items/items.router';
import { partiesRouter } from './modules/parties/parties.router';
import { inventoryRouter } from './modules/inventory/inventory.router';
import { salesRouter } from './modules/sales/sales.router';
import { returnsRouter } from './modules/returns/returns.router';
import { paymentsRouter } from './modules/payments/payments.router';
import { expensesRouter } from './modules/expenses/expenses.router';
import { reportsRouter } from './modules/reports/reports.router';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/parties', partiesRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/sales', salesRouter);
app.use('/api/returns', returnsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/reports', reportsRouter);

app.use(errorHandler);

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`SGF backend running on :${PORT}`));
