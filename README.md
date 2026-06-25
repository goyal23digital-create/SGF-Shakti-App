# Shakti Gold Furniture — ERP System

Full-stack ERP replacing the Google Sheets workbook. Covers all 8 data tabs plus derived analytics.

## Stack

| Layer | Tech |
|-------|------|
| Database | PostgreSQL 16 (Decimal for all money/weights) |
| Backend | Node.js + TypeScript + Express + Prisma |
| Frontend | React 18 + TypeScript + Vite + TailwindCSS + TanStack Query |
| Container | Docker Compose |

## Quick start

```bash
# 1. Start the database
docker compose up db -d

# 2. Backend setup
cd backend
npm install
npx prisma migrate dev --name init
ts-node src/prisma/seed.ts     # creates admin@sgf.com / admin123 + sample data

# 3. Start backend
npm run dev

# 4. Frontend setup (separate terminal)
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

Or run everything with Docker:
```bash
docker compose up --build
```

## Import existing spreadsheet data

Export each Google Sheets tab as CSV, rename to match:

| Tab | CSV filename |
|-----|-------------|
| Item List | `item-list.csv` |
| Party And Rate List | `party-rate-list.csv` |
| Inventory In | `inventory-in.csv` |
| Inventory Out | `inventory-out.csv` |
| Return | `returns.csv` |
| Cash In Party Payment | `cash-in.csv` |
| Cash Out Expenses | `cash-out.csv` |

```bash
# Dry run (no writes) — shows what would be imported
cd backend
ts-node src/importer/index.ts --dry-run --csv-dir=./csv-exports --fy=2026-27

# Live import
ts-node src/importer/index.ts --csv-dir=./csv-exports --fy=2026-27
```

## Data model summary

- `items` — product master (code, name, weight/production specs)
- `parties` — dealer master (name, city)
- `party_item_rates` — negotiated prices per party × item
- `inventory_in` — production receipts (PRODUCTION / OPENING / ADJUSTMENT)
- `sales` — dispatch ledger; `value` computed as `quantity × unit_price`
- `sale_returns` — goods returned
- `party_payments` — money received from dealers
- `expenses` — outgoing payments
- `audit_logs` — full change history (who, when, old/new values)
- `users` — auth with roles (ADMIN / MANAGER / OPERATOR / VIEWER)

## Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | KPIs, stock alerts, outstanding balances, sales chart |
| `/inventory` | Production In ledger |
| `/sales` | Sales/Dispatch ledger with auto-fill pricing |
| `/returns` | Returns ledger |
| `/payments` | Party payments received |
| `/expenses` | Cash-out expenses |
| `/parties` | Party master + rate matrix editor |
| `/parties/:id/ledger` | Chronological party statement with running balance |
| `/items` | Item master |
| `/reports` | Inventory status, sales analysis, production analysis, expense summary |
