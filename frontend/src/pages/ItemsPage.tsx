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
    const data = { code: form.code.trim(), name: form.name.trim(), avgWeight: form.avgWeight || undefined, withFlashWeight: form.withFlashWeight || undefined, maxWeight: form.maxWeight || undefined };
    const op = editId ? update.mutateAsync({ id: editId, ...data }) : create.mutateAsync(data);
    op.then(() => { setForm({ code: '', name: '', avgWeight: '', withFlashWeight: '', maxWeight: '' }); setEditId(null); }).catch((e) => setError(e.response?.data?.error ?? 'Error'));
  }

  function startEdit(item: any) {
    setEditId(item.id);
    setForm({ code: item.code, name: item.name, avgWeight: item.avgWeight ?? '', withFlashWeight: item.withFlashWeight ?? '', maxWeight: item.maxWeight ?? '' });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Items (Product Master)</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <Field label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} required disabled={!!editId} />
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required width="w-48" />
        <Field label="Avg Weight" value={form.avgWeight} onChange={(v) => setForm({ ...form, avgWeight: v })} type="number" width="w-28" />
        <Field label="Flash Weight" value={form.withFlashWeight} onChange={(v) => setForm({ ...form, withFlashWeight: v })} type="number" width="w-28" />
        <Field label="Max Weight" value={form.maxWeight} onChange={(v) => setForm({ ...form, maxWeight: v })} type="number" width="w-28" />
        <button type="submit" className="bg-brand-600 text-white px-4 py-1.5 rounded text-sm hover:bg-brand-700">{editId ? 'Update' : 'Add Item'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ code: '', name: '', avgWeight: '', withFlashWeight: '', maxWeight: '' }); }} className="text-sm text-gray-500 hover:underline">Cancel</button>}
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
        {isLoading ? <p className="p-4 text-gray-400">Loading…</p> : (
          <table className="table-grid">
            <thead>
              <tr><th>Code</th><th>Name</th><th>Avg Wt</th><th>Flash Wt</th><th>Max Wt</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id}>
                  <td className="font-mono font-bold">{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.avgWeight}</td>
                  <td>{item.withFlashWeight}</td>
                  <td>{item.maxWeight}</td>
                  <td><button onClick={() => startEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, type = 'text', width = 'w-32', disabled = false }: any) {
  return (
    <div className={`flex flex-col gap-0.5 ${width}`}>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        required={required} disabled={disabled}
        className="border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100"
        step={type === 'number' ? '0.001' : undefined}
      />
    </div>
  );
}
