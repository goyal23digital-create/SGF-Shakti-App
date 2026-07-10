import { useState } from 'react';
import { useItems, useCreateItem, useUpdateItem } from '../api/hooks';

export function ItemsPage() {
  const { data: items = [], isLoading } = useItems();
  const create = useCreateItem();
  const update = useUpdateItem();
  const [form, setForm] = useState({ code: '', name: '', avgWeight: '', withFlashWeight: '', maxWeight: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const data = {
      code: form.code.trim(), name: form.name.trim(),
      avgWeight: form.avgWeight || undefined,
      withFlashWeight: form.withFlashWeight || undefined,
      maxWeight: form.maxWeight || undefined,
    };
    const op = editId ? update.mutateAsync({ id: editId, ...data }) : create.mutateAsync(data);
    op.then(() => { setForm({ code: '', name: '', avgWeight: '', withFlashWeight: '', maxWeight: '' }); setEditId(null); })
      .catch((e: any) => setError(e.response?.data?.error ?? 'Error'));
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({ code: item.code, name: item.name, avgWeight: item.avgWeight ?? '', withFlashWeight: item.withFlashWeight ?? '', maxWeight: item.maxWeight ?? '' });
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Items (Product Master)</h1>
          <p className="page-subtitle">{items.length} items configured</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">{editId ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="form-field">
              <label className="label">Code *</label>
              <input type="text" className="input disabled:bg-slate-50 disabled:text-gray-400" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required disabled={!!editId} placeholder="e.g. 9L" />
            </div>
            <div className="form-field md:col-span-2">
              <label className="label">Name *</label>
              <input type="text" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Product name" />
            </div>
            <div className="form-field">
              <label className="label">Avg Weight (kg)</label>
              <input type="number" className="input" value={form.avgWeight} onChange={(e) => setForm({ ...form, avgWeight: e.target.value })} step="0.001" />
            </div>
            <div className="form-field">
              <label className="label">Flash Weight (kg)</label>
              <input type="number" className="input" value={form.withFlashWeight} onChange={(e) => setForm({ ...form, withFlashWeight: e.target.value })} step="0.001" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary" disabled={create.isPending || update.isPending}>{editId ? 'Update Item' : 'Add Item'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ code: '', name: '', avgWeight: '', withFlashWeight: '', maxWeight: '' }); }} className="btn-secondary">Cancel</button>}
            {error && <span className="text-red-500 text-sm">{error}</span>}
          </div>
        </form>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <p className="p-5 text-gray-400">Loading…</p> : (
          <table className="data-table">
            <thead>
              <tr><th>Code</th><th>Name</th><th className="text-right">Avg Weight</th><th className="text-right">Flash Wt</th><th className="text-right">Max Wt</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id}>
                  <td><span className="badge badge-blue font-mono">{item.code}</span></td>
                  <td className="font-medium">{item.name}</td>
                  <td className="text-right font-mono text-gray-600">{item.avgWeight ? `${item.avgWeight} kg` : '—'}</td>
                  <td className="text-right font-mono text-gray-600">{item.withFlashWeight ? `${item.withFlashWeight} kg` : '—'}</td>
                  <td className="text-right font-mono text-gray-600">{item.maxWeight ? `${item.maxWeight} kg` : '—'}</td>
                  <td><button onClick={() => startEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
