import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ItemsPage } from './pages/ItemsPage';
import { PartiesPage } from './pages/PartiesPage';
import { InventoryPage } from './pages/InventoryPage';
import { SalesPage } from './pages/SalesPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { PartyLedgerPage } from './pages/PartyLedgerPage';
import { ReportsPage } from './pages/ReportsPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/parties" element={<PartiesPage />} />
        <Route path="/parties/:id/ledger" element={<PartyLedgerPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}
