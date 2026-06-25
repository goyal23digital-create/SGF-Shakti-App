import { useState } from 'react';
import { useInventoryIn, useCreateInventoryIn, useItems } from '../api/hooks';
import { FySelector } from '../components/FySelector';
import { api } from '../api/client';

export function InventoryPage() {
  const [fy, setFy] = useState('2026-27');
  const { data: rows = [], isLoading } = useInventoryIn({ fyYear: fy });
  const { data: items = [] } = useItems();
  const create = useCreateInventoryIn();
  const [form, setForm] = useState({ date: today(), itemId: '', quantity: '', type: 'PRODUCTION', remarks: '' });
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutateAsync({ ...form, fyYear: fy }).then(() => setForm({ ...form, quantity: '', remarks: '' })).catch((e) => setError(e.response?.data?.error ?? 'Error'));
  }

  async function voidRow(id: number) {
    if (!confirm('Void this entry?')) return;
    await api.delete(`/inventory/${id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Production In (Inventory In)</h1>
        <FySelector value={fy} onChange={setFy} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <Field label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} type="date" required />
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium text-gray-600">Item</label>
          <select value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required className="border border-gray-300 rounded px-2 py-1 text-sm w-52">
            <option value="">— select item —</option>
            {items.map((i: any) => <option key={i.id} value={i.id}>{i.code} — {i.name}</option>)}
          </select>
        </div>
        <Field label="Quantity" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} type="number" required />
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium text-gray-600">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="PRODUCTION">Production</option>
            <option value="OPENING">Opening B/F</option>
            <option value="ADJUSTMENT">Adjustment</option>
          </select>
        </div>
        <Field label="Remarks" value={form.remarks} onChange={(v) => setForm({ ...form, remarks: v })} width="w-48" />
        <button type="submit" className="bg-brand-600 text-white px-4 py-1.5 rounded text-sm hover:bg-brand-700">Add Row</button>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
        {isLoading ? <p className="p-4 text-gray-400">Loading…</p> : (
          <table className="table-grid">
            <thead><tr><th>Date</th><th>Code</th><th>Item</th><th>Qty</th><th>Type</th><th>Remarks</th><th></th></tr></thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.date?.slice(0, 10)}</td>
                  <td className="font-mono">{r.item.code}</td>
                  <td>{r.item.name}</td>
                  <td className="text-right font-mono">{parseFloat(r.quantity).toFixed(0)}</td>
                  <td><span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{r.type}</span></td>
                  <td className="text-gray-500 text-xs">{r.remarks}</td>
                  <td><button onClick={() => voidRow(r.id)} className="text-red-500 hover:underline text-xs">Void</button></td>
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
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="border border-gray-300 rounded px-2 py-1 text-sm" step={type === 'number' ? '0.001' : undefined} />
    </div>
  );
}
