import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParties, useCreateParty, useItems } from '../api/hooks';
import { api } from '../api/client';

const EMPTY_FORM = { name: '', city: '', phone: '', gstin: '', address: '', stateCode: '' };

export function PartiesPage() {
  const { data: parties = [], isLoading } = useParties();
  const { data: items = [] } = useItems();
  const create = useCreateParty();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [rates, setRates] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutateAsync(form)
      .then(() => setForm(EMPTY_FORM))
      .catch((e: any) => setError(e.response?.data?.error ?? 'Error'));
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
      <div className="page-header">
        <div>
          <h1 className="page-title">Parties (Dealers)</h1>
          <p className="page-subtitle">{parties.length} active parties</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Add New Party</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="form-field">
              <label className="label">Party Name *</label>
              <input type="text" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Full legal name" />
            </div>
            <div className="form-field">
              <label className="label">City</label>
              <input type="text" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="label">Phone</label>
              <input type="text" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="label">GSTIN</label>
              <input type="text" className="input" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} placeholder="15-char GSTIN" maxLength={15} />
            </div>
            <div className="form-field">
              <label className="label">State Code</label>
              <input type="text" className="input" value={form.stateCode} onChange={(e) => setForm({ ...form, stateCode: e.target.value })} placeholder="e.g. 03" maxLength={2} />
            </div>
            <div className="form-field">
              <label className="label">Address</label>
              <input type="text" className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street / area" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary" disabled={create.isPending}>{create.isPending ? 'Adding…' : 'Add Party'}</button>
            {error && <span className="text-red-500 text-sm">{error}</span>}
          </div>
        </form>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <p className="p-5 text-gray-400">Loading…</p> : (
          <table className="data-table">
            <thead>
              <tr><th>Party Name</th><th>City</th><th>Phone</th><th>GSTIN</th><th>State</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {parties.map((p: any) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td className="text-gray-500">{p.city}</td>
                  <td className="text-gray-500">{p.phone}</td>
                  <td className="font-mono text-xs text-gray-500">{p.gstin || '—'}</td>
                  <td><span className="badge badge-gray">{p.stateCode || '—'}</span></td>
                  <td>
                    <div className="flex gap-3">
                      <button onClick={() => openRates(p)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Rates</button>
                      <Link to={`/parties/${p.id}/ledger`} className="text-green-600 hover:text-green-800 text-xs font-medium">Ledger</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedParty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Rate Matrix — {selectedParty.name}</h2>
              <button onClick={() => setSelectedParty(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="data-table">
                <thead><tr><th>Code</th><th>Item</th><th>Rate (₹/unit)</th></tr></thead>
                <tbody>
                  {items.map((item: any) => (
                    <tr key={item.id}>
                      <td><span className="badge badge-blue">{item.code}</span></td>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="number" step="0.01" min="0"
                          value={rates[item.id] ?? ''}
                          onChange={(e) => setRates({ ...rates, [item.id]: e.target.value })}
                          className="input w-28" placeholder="—"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <button onClick={saveRates} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Rates'}</button>
              <button onClick={() => setSelectedParty(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
