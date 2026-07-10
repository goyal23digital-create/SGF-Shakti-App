import { useState } from 'react';
import { useInventoryIn, useCreateInventoryIn, useVoidInventoryIn, useItems, useInventoryStatus } from '../api/hooks';
import { FySelector } from '../components/FySelector';

function today() { return new Date().toISOString().slice(0, 10); }

const typeColor: Record<string, string> = { PRODUCTION: 'badge-green', OPENING: 'badge-blue', ADJUSTMENT: 'badge-orange' };

export function InventoryPage() {
  const [fy, setFy] = useState('2026-27');
  const { data: rows = [], isLoading } = useInventoryIn({ fyYear: fy });
  const { data: items = [] } = useItems();
  const { data: stock = [] } = useInventoryStatus(fy);
  const create = useCreateInventoryIn();
  const voidInv = useVoidInventoryIn();
  const [form, setForm] = useState({ date: today(), itemId: '', quantity: '', type: 'PRODUCTION', remarks: '' });
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    create.mutateAsync({ ...form, fyYear: fy })
      .then(() => setForm((f) => ({ ...f, quantity: '', remarks: '' })))
      .catch((e: any) => setError(e.response?.data?.error ?? 'Error'));
  }

  const selectedStock = stock.find((s: any) => String(s.id) === form.itemId);
  const totalQty = rows.reduce((s: number, r: any) => s + parseFloat(r.quantity), 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Production In</h1>
          <p className="page-subtitle">{rows.length} entries · Total {totalQty.toLocaleString('en-IN', { maximumFractionDigits: 0 })} units</p>
        </div>
        <FySelector value={fy} onChange={setFy} />
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">New Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="form-field">
              <label className="label">Date</label>
              <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-field">
              <label className="label">Item</label>
              <select className="input" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required>
                <option value="">— select item —</option>
                {items.map((i: any) => <option key={i.id} value={i.id}>{i.code} — {i.name}</option>)}
              </select>
              {selectedStock && (
                <p className="text-xs mt-1 text-gray-500">Stock on hand: <span className={`font-semibold ${parseFloat(selectedStock.onHand) < 10 ? 'text-red-500' : 'text-green-600'}`}>{parseFloat(selectedStock.onHand).toFixed(0)} units</span></p>
              )}
            </div>
            <div className="form-field">
              <label className="label">Quantity</label>
              <input type="number" className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required min="0" step="1" />
            </div>
            <div className="form-field">
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="PRODUCTION">Production</option>
                <option value="OPENING">Opening B/F</option>
                <option value="ADJUSTMENT">Adjustment</option>
              </select>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className="form-field flex-1">
              <label className="label">Remarks</label>
              <input type="text" className="input" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Optional" />
            </div>
            <button type="submit" className="btn-primary" disabled={create.isPending}>{create.isPending ? 'Saving…' : 'Add Row'}</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <p className="p-5 text-gray-400">Loading…</p> : (
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Item</th><th className="text-right">Quantity</th><th>Type</th><th>Remarks</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td className="text-gray-500">{r.date?.slice(0, 10)}</td>
                  <td><span className="badge badge-blue mr-1">{r.item.code}</span>{r.item.name}</td>
                  <td className="text-right font-mono font-semibold">{parseFloat(r.quantity).toFixed(0)}</td>
                  <td><span className={`badge ${typeColor[r.type] ?? 'badge-gray'}`}>{r.type}</span></td>
                  <td className="text-gray-400 text-xs">{r.remarks}</td>
                  <td><button onClick={() => { if (confirm('Void this entry?')) voidInv.mutate(r.id); }} className="btn-danger">Void</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="text-right text-xs text-gray-500">Total</td>
                <td className="text-right font-mono">{totalQty.toLocaleString('en-IN', { maximumFractionDigits: 0 })} units</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
