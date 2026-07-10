import { useState } from 'react';
import { useExpenses, useCreateExpense, useVoidExpense, useExpenseCategories } from '../api/hooks';
import { FySelector } from '../components/FySelector';

function today() { return new Date().toISOString().slice(0, 10); }

export function ExpensesPage() {
  const [fy, setFy] = useState('2026-27');
  const { data: rows = [], isLoading } = useExpenses({ fyYear: fy });
  const { data: categories = [] } = useExpenseCategories();
  const create = useCreateExpense();
  const voidExpense = useVoidExpense();
  const [form, setForm] = useState({ date: today(), payee: '', categoryId: '', amount: '', paymentMode: 'CASH', remarks: '' });
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    create.mutateAsync({ ...form, fyYear: fy })
      .then(() => setForm((f) => ({ ...f, payee: '', amount: '', remarks: '' })))
      .catch((e: any) => setError(e.response?.data?.error ?? 'Error'));
  }

  const total = rows.reduce((s: number, r: any) => s + parseFloat(r.amount), 0);

  const modeColor: Record<string, string> = { CASH: 'badge-green', BANK: 'badge-blue', OTHER: 'badge-gray' };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses (Cash Out)</h1>
          <p className="page-subtitle">Total: ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <FySelector value={fy} onChange={setFy} />
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Record Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="form-field">
              <label className="label">Date</label>
              <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-field">
              <label className="label">Payee</label>
              <input type="text" className="input" value={form.payee} onChange={(e) => setForm({ ...form, payee: e.target.value })} required placeholder="Name / vendor" />
            </div>
            <div className="form-field">
              <label className="label">Category</label>
              <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">— select —</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="label">Amount (₹)</label>
              <input type="number" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required min="0" step="0.01" />
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className="form-field w-40">
              <label className="label">Mode</label>
              <select className="input" value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}>
                <option value="CASH">Cash</option>
                <option value="BANK">Bank</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="form-field flex-1">
              <label className="label">Remarks</label>
              <input type="text" className="input" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Optional" />
            </div>
            <button type="submit" className="btn-primary" disabled={create.isPending}>{create.isPending ? 'Saving…' : 'Add Expense'}</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <p className="p-5 text-gray-400">Loading…</p> : (
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Payee</th><th>Category</th><th className="text-right">Amount</th><th>Mode</th><th>Remarks</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td className="text-gray-500">{r.date?.slice(0, 10)}</td>
                  <td className="font-medium">{r.payee}</td>
                  <td>{r.category ? <span className="badge badge-orange">{r.category.name}</span> : <span className="text-gray-400 text-xs">—</span>}</td>
                  <td className="text-right font-mono font-semibold text-red-600">₹{parseFloat(r.amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td><span className={`badge ${modeColor[r.paymentMode] ?? 'badge-gray'}`}>{r.paymentMode}</span></td>
                  <td className="text-gray-400 text-xs">{r.remarks}</td>
                  <td><button onClick={() => { if (confirm('Void this expense?')) voidExpense.mutate(r.id); }} className="btn-danger">Void</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right text-xs text-gray-500">Total</td>
                <td className="text-right font-mono text-red-600">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
