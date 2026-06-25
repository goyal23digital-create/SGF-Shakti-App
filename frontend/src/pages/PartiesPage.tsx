import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParties, useCreateParty, useItems } from '../api/hooks';
import { api } from '../api/client';

export function PartiesPage() {
  const { data: parties = [], isLoading } = useParties();
  const { data: items = [] } = useItems();
  const create = useCreateParty();
  const [form, setForm] = useState({ name: '', city: '', phone: '' });
  const [error, setError] = useState('');
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [rates, setRates] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutateAsync(form).then(() => setForm({ name: '', city: '', phone: '' })).catch((e) => setError(e.response?.data?.error ?? 'Error'));
  }

  async function openRates(party: any) {
    setSelectedParty(party);
    const detail = await api.get(`/parties/${party.id}`);
    const rateMap: Record<number, string> = {};
    for (const r of detail.data.rates) rateMap[r.itemId] = String(r.rate);
    setRates(rateMap);
  }

  async function saveRates() {
    setSaving(true);
    const payload = items.map((item: any) => ({ itemId: item.id, rate: rates[item.id] ?? '0' })).filter((r: any) => parseFloat(r.rate) > 0);
    await api.put(`/parties/${selectedParty.id}/rates`, { rates: payload });
    setSaving(false);
    setSelectedParty(null);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Parties (Dealers)</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <Field label="Party Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required width="w-64" />
        <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} width="w-36" />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} width="w-36" />
        <button type="submit" className="bg-brand-600 text-white px-4 py-1.5 rounded text-sm hover:bg-brand-700">Add Party</button>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
        {isLoading ? <p className="p-4 text-gray-400">Loading…</p> : (
          <table className="table-grid">
            <thead><tr><th>Name</th><th>City</th><th>Phone</th><th>Actions</th></tr></thead>
            <tbody>
              {parties.map((p: any) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.city}</td>
                  <td>{p.phone}</td>
                  <td className="flex gap-3">
                    <button onClick={() => openRates(p)} className="text-blue-600 hover:underline text-xs">Rates</button>
                    <Link to={`/parties/${p.id}/ledger`} className="text-green-600 hover:underline text-xs">Ledger</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rate editor modal */}
      {selectedParty && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <h2 className="font-bold text-lg mb-4">Rates — {selectedParty.name}</h2>
            <div className="overflow-y-auto flex-1">
              <table className="table-grid">
                <thead><tr><th>Code</th><th>Item</th><th>Rate (₹)</th></tr></thead>
                <tbody>
                  {items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="font-mono">{item.code}</td>
                      <td>{item.name}</td>
                      <td><input type="number" step="0.01" value={rates[item.id] ?? ''} onChange={(e) => setRates({ ...rates, [item.id]: e.target.value })} className="border border-gray-300 rounded px-2 py-0.5 w-24 text-sm" placeholder="—" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={saveRates} disabled={saving} className="bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700 text-sm">{saving ? 'Saving…' : 'Save Rates'}</button>
              <button onClick={() => setSelectedParty(null)} className="text-gray-500 hover:underline text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, required, width = 'w-32' }: any) {
  return (
    <div className={`flex flex-col gap-0.5 ${width}`}>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required} className="border border-gray-300 rounded px-2 py-1 text-sm" />
    </div>
  );
}
