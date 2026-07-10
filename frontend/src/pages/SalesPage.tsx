import { useState, useEffect, useRef } from 'react';
import { useSales, useCreateSale, useUpdateSale, useVoidSale, useItems, useParties, useSettings } from '../api/hooks';
import { FySelector } from '../components/FySelector';
import { api } from '../api/client';

function today() { return new Date().toISOString().slice(0, 10); }
function fmt(v: any) { return parseFloat(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 }); }

const EMPTY = {
  date: today(), itemId: '', partyId: '', quantity: '', unitPrice: '',
  discountAmount: '0', carriageAmount: '0', taxPercent: '18', gstType: 'IGST', remarks: '',
};

export function SalesPage() {
  const [fy, setFy] = useState('2026-27');
  const { data: rows = [], isLoading } = useSales({ fyYear: fy });
  const { data: items = [] } = useItems();
  const { data: parties = [] } = useParties();
  const create = useCreateSale();
  const update = useUpdateSale();
  const voidSale = useVoidSale();
  const { data: settings } = useSettings();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const skipRateFill = useRef(false);
  const seededDefaults = useRef(false);

  useEffect(() => {
    if (seededDefaults.current || !settings || editId !== null) return;
    seededDefaults.current = true;
    setForm((f) => {
      if (f.quantity !== '' || f.unitPrice !== '' || f.partyId !== '' || f.itemId !== '' || f.remarks !== '') return f;
      return {
        ...f,
        taxPercent: settings.defaultTaxPercent != null ? String(settings.defaultTaxPercent) : f.taxPercent,
        gstType: settings.defaultGstType ?? f.gstType,
      };
    });
  }, [settings, editId]);

  useEffect(() => {
    if (!form.partyId || !form.itemId) return;
    if (skipRateFill.current) { skipRateFill.current = false; return; }
    api.get(`/parties/${form.partyId}/rate/${form.itemId}`).then((r) => {
      if (r.data.rate != null) setForm((f) => ({ ...f, unitPrice: String(r.data.rate) }));
    }).catch(() => {});
  }, [form.partyId, form.itemId]);

  const qty = parseFloat(form.quantity) || 0;
  const price = parseFloat(form.unitPrice) || 0;
  const discount = parseFloat(form.discountAmount) || 0;
  const carriage = parseFloat(form.carriageAmount) || 0;
  const taxPct = parseFloat(form.taxPercent) || 0;
  const baseValue = qty * price - discount + carriage;
  const taxAmount = baseValue * taxPct / 100;
  const grandTotal = baseValue + taxAmount;

  function startEdit(r: any) {
    setError('');
    const partyId = String(r.partyId ?? r.party?.id ?? '');
    const itemId = String(r.itemId ?? r.item?.id ?? '');
    if (partyId !== form.partyId || itemId !== form.itemId) skipRateFill.current = true;
    setForm({
      date: r.date?.slice(0, 10) ?? today(),
      itemId,
      partyId,
      quantity: String(parseFloat(r.quantity ?? 0) || 0),
      unitPrice: String(parseFloat(r.unitPrice ?? 0) || 0),
      discountAmount: String(parseFloat(r.discountAmount ?? 0) || 0),
      carriageAmount: String(parseFloat(r.carriageAmount ?? 0) || 0),
      taxPercent: String(parseFloat(r.taxPercent ?? 0) || 0),
      gstType: r.gstType ?? 'IGST',
      remarks: r.remarks ?? '',
    });
    setEditId(r.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ ...EMPTY, date: today() });
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const payload = { ...form, fyYear: fy, carriageAmount: carriage, taxPercent: taxPct, discountAmount: discount };
    if (editId !== null) {
      update.mutateAsync({ id: editId, ...payload })
        .then(() => { setEditId(null); setForm({ ...EMPTY, date: today() }); })
        .catch((e: any) => setError(e.response?.data?.error ?? 'Error'));
    } else {
      create.mutateAsync(payload)
        .then(() => setForm((f) => ({ ...f, quantity: '', discountAmount: '0', carriageAmount: '0', remarks: '' })))
        .catch((e: any) => setError(e.response?.data?.error ?? 'Error'));
    }
  }

  const totalGrand = rows.reduce((s: number, r: any) => s + parseFloat(r.grandTotal ?? r.value ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales / Dispatch</h1>
          <p className="page-subtitle">{rows.length} entries · Grand Total ₹{totalGrand.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <FySelector value={fy} onChange={setFy} />
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">New Sale Entry</h2>
        <form onSubmit={handleSubmit} ref={formRef}>
          {editId !== null && (
            <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
              <span>✏️ Editing entry #{editId} — saving will overwrite it</span>
              <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>
            </div>
          )}
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
            </div>
            <div className="form-field md:col-span-2">
              <label className="label">Item</label>
              <select className="input" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required>
                <option value="">— select item —</option>
                {items.map((i: any) => <option key={i.id} value={i.id}>{i.code} — {i.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="form-field">
              <label className="label">Quantity</label>
              <input type="number" className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required min="0" step="1" />
            </div>
            <div className="form-field">
              <label className="label">Unit Price (₹)</label>
              <input type="number" className="input" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required min="0" step="0.01" />
            </div>
            <div className="form-field">
              <label className="label">Discount (₹)</label>
              <input type="number" className="input" value={form.discountAmount} onChange={(e) => setForm({ ...form, discountAmount: e.target.value })} min="0" step="0.01" />
            </div>
            <div className="form-field">
              <label className="label">Carriage (₹)</label>
              <input type="number" className="input" value={form.carriageAmount} onChange={(e) => setForm({ ...form, carriageAmount: e.target.value })} min="0" step="0.01" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="form-field">
              <label className="label">GST Type</label>
              <select className="input" value={form.gstType} onChange={(e) => setForm({ ...form, gstType: e.target.value })}>
                <option value="IGST">IGST</option>
                <option value="CGST+SGST">CGST + SGST</option>
              </select>
            </div>
            <div className="form-field">
              <label className="label">GST %</label>
              <input type="number" className="input" value={form.taxPercent} onChange={(e) => setForm({ ...form, taxPercent: e.target.value })} min="0" max="28" step="0.01" />
            </div>
            <div className="form-field">
              <label className="label">Base Value</label>
              <div className="input-readonly">₹{fmt(baseValue)}</div>
            </div>
            <div className="form-field">
              <label className="label">Tax Amount</label>
              <div className="input-readonly">₹{fmt(taxAmount)}</div>
            </div>
            <div className="form-field">
              <label className="label">Grand Total</label>
              <div className="input-readonly font-semibold text-indigo-700">₹{fmt(grandTotal)}</div>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className="form-field flex-1">
              <label className="label">Remarks</label>
              <input type="text" className="input" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Optional" />
            </div>
            <button type="submit" className="btn-primary" disabled={create.isPending || update.isPending}>
              {editId !== null ? (update.isPending ? 'Updating…' : 'Update') : (create.isPending ? 'Saving…' : 'Add Sale')}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? <p className="p-5 text-gray-400">Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th><th>Party</th><th>Item</th>
                  <th className="text-right">Qty</th><th className="text-right">Price</th>
                  <th className="text-right">Disc</th><th className="text-right">Carriage</th>
                  <th className="text-right">Base Value</th><th>GST</th>
                  <th className="text-right">Grand Total</th><th>Remarks</th><th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.id}>
                    <td className="text-gray-500">{r.date?.slice(0, 10)}</td>
                    <td className="font-medium">{r.party.name}</td>
                    <td><span className="badge badge-blue mr-1">{r.item.code}</span>{r.item.name}</td>
                    <td className="text-right font-mono">{parseFloat(r.quantity).toFixed(0)}</td>
                    <td className="text-right font-mono">₹{fmt(r.unitPrice)}</td>
                    <td className="text-right font-mono text-gray-400">{parseFloat(r.discountAmount || 0) > 0 ? `₹${fmt(r.discountAmount)}` : '—'}</td>
                    <td className="text-right font-mono text-gray-400">{parseFloat(r.carriageAmount || 0) > 0 ? `₹${fmt(r.carriageAmount)}` : '—'}</td>
                    <td className="text-right font-mono">₹{fmt(r.value)}</td>
                    <td><span className="badge badge-purple">{r.gstType} {parseFloat(r.taxPercent || 0).toFixed(0)}%</span></td>
                    <td className="text-right font-mono font-semibold text-indigo-700">₹{fmt(r.grandTotal)}</td>
                    <td className="text-gray-400 text-xs">{r.remarks}</td>
                    <td className="whitespace-nowrap">
                      <button onClick={() => startEdit(r)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium mr-2">Edit</button>
                      <button onClick={() => { if (confirm('Void this sale?')) voidSale.mutate(r.id); }} className="btn-danger">Void</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={9} className="text-right text-xs text-gray-500">Grand Total</td>
                  <td className="text-right font-mono text-indigo-700">₹{totalGrand.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
