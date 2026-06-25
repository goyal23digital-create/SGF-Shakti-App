import { useState } from 'react';
import { usePayments, useCreatePayment, useParties } from '../api/hooks';
import { FySelector } from '../components/FySelector';
import { api } from '../api/client';

export function PaymentsPage() {
  const [fy, setFy] = useState('2026-27');
  const { data: rows = [], isLoading } = usePayments({ fyYear: fy });
  const { data: parties = [] } = useParties();
  const create = useCreatePayment();
  const [form, setForm] = useState({ date: today(), partyId: '', amount: '', paymentMode: 'CASH', remarks: '' });
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutateAsync({ ...form, fyYear: fy }).then(() => setForm({ ...form, amount: '', remarks: '' })).catch((e) => setError(e.response?.data?.error ?? 'Error'));
  }

  const total = rows.reduce((s: number, r: any) => s + parseFloat(r.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Party Payments Received</h1>
          <p className="text-gray-500 text-sm">Total collected: ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <FySelector value={fy} onChange={setFy} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <Field label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} type="date" required />
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium text-gray-600">Party</label>
          <select value={form.partyId} onChange={(e) => setForm({ ...form, partyId: e.target.value })} required className="border border-gray-300 rounded px-2 py-1 text-sm w-52">
            <option value="">— select party —</option>
            {parties.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <Field label="Amount (₹)" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} type="number" required />
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium text-gray-600">Mode</label>
          <select value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })} className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="CASH">Cash</option>
            <option value="BANK">Bank</option>
            <option value="TRANSPORT">Transport</option>
            <option value="BF">B/F</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <Field label="Remarks" value={form.remarks} onChange={(v) => setForm({ ...form, remarks: v })} width="w-40" />
        <button type="submit" className="bg-brand-600 text-white px-4 py-1.5 rounded text-sm hover:bg-brand-700">Add Payment</button>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
        {isLoading ? <p className="p-4 text-gray-400">Loading…</p> : (
          <table className="table-grid">
            <thead><tr><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Mode</th><th>Remarks</th><th></th></tr></thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.date?.slice(0, 10)}</td>
                  <td>{r.party.name}</td>
                  <td className="text-right font-mono">₹{parseFloat(r.amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td><span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{r.paymentMode}</span></td>
                  <td className="text-gray-500 text-xs">{r.remarks}</td>
                  <td><button onClick={() => api.delete(`/payments/${r.id}`)} className="text-red-500 hover:underline text-xs">Void</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function today() { return new Date().toISOString().slice(0, 10); }
function Field({ label, value, onChange, type = 'text', required, width = 'w-28' }: any) {
  return (
    <div className={`flex flex-col gap-0.5 ${width}`}>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="border border-gray-300 rounded px-2 py-1 text-sm" step={type === 'number' ? '0.01' : undefined} />
    </div>
  );
}
