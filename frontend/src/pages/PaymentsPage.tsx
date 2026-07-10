import { useState, useEffect } from 'react';
import { usePayments, useCreatePayment, useVoidPayment, useParties, usePartyBalances } from '../api/hooks';
import { FySelector } from '../components/FySelector';

function today() { return new Date().toISOString().slice(0, 10); }

export function PaymentsPage() {
  const [fy, setFy] = useState('2026-27');
  const { data: rows = [], isLoading } = usePayments({ fyYear: fy });
  const { data: parties = [] } = useParties();
  const { data: balances = [] } = usePartyBalances(fy);
  const create = useCreatePayment();
  const voidPayment = useVoidPayment();
  const [form, setForm] = useState({ date: today(), partyId: '', amount: '', paymentMode: 'CASH', remarks: '' });
  const [error, setError] = useState('');

  const selectedBalance = balances.find((b: any) => String(b.id) === form.partyId);
  const outstanding = selectedBalance ? parseFloat(selectedBalance.outstanding) : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    create.mutateAsync({ ...form, fyYear: fy })
      .then(() => setForm((f) => ({ ...f, amount: '', remarks: '' })))
      .catch((e: any) => setError(e.response?.data?.error ?? 'Error'));
  }

  const total = rows.reduce((s: number, r: any) => s + parseFloat(r.amount), 0);

  const modeColor: Record<string, string> = { CASH: 'badge-green', BANK: 'badge-blue', TRANSPORT: 'badge-orange', BF: 'badge-gray', OTHER: 'badge-gray' };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Party Payments Received</h1>
          <p className="page-subtitle">Total collected: ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <FySelector value={fy} onChange={setFy} />
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Record Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="form-field">
              <label className="label">Date</label>
              <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-field">
              <label className="label">Party</label>
              <select className="input" value={form.partyId} onChange={(e) => setForm({ ...form, partyId: e.target.value })} required>
                <option value="">— select party —</option>
                {parties.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {outstanding !== null && (
                <p className={`text-xs mt-1 font-medium ${outstanding > 0 ? 'text-red-500' : 'text-green-600'}`}>
                  Outstanding: ₹{outstanding.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              )}
            </div>
            <div className="form-field">
              <label className="label">Amount (₹)</label>
              <input type="number" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required min="0" step="0.01" />
            </div>
            <div className="form-field">
              <label className="label">Mode</label>
              <select className="input" value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}>
                <option value="CASH">Cash</option>
                <option value="BANK">Bank / NEFT</option>
                <option value="TRANSPORT">Transport</option>
                <option value="BF">B/F</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className="form-field flex-1">
              <label className="label">Remarks</label>
              <input type="text" className="input" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Optional" />
            </div>
            <button type="submit" className="btn-primary" disabled={create.isPending}>{create.isPending ? 'Saving…' : 'Add Payment'}</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <p className="p-5 text-gray-400">Loading…</p> : (
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Mode</th><th>Remarks</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td className="text-gray-500">{r.date?.slice(0, 10)}</td>
                  <td className="font-medium">{r.party.name}</td>
                  <td className="text-right font-mono font-semibold text-green-700">₹{parseFloat(r.amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td><span className={`badge ${modeColor[r.paymentMode] ?? 'badge-gray'}`}>{r.paymentMode}</span></td>
                  <td className="text-gray-400 text-xs">{r.remarks}</td>
                  <td><button onClick={() => { if (confirm('Void this payment?')) voidPayment.mutate(r.id); }} className="btn-danger">Void</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="text-right text-xs text-gray-500">Total Collected</td>
                <td className="text-right font-mono text-green-700">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
