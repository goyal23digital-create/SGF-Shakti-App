import { useEffect, useRef, useState } from 'react';
import { useSettings, useUpdateSettings } from '../api/hooks';
import { api } from '../api/client';
import { Logo } from '../components/Logo';

const ACCENT_PRESETS = [
  { color: '#4f46e5', name: 'Indigo' },
  { color: '#0ea5e9', name: 'Sky' },
  { color: '#059669', name: 'Emerald' },
  { color: '#dc2626', name: 'Red' },
  { color: '#d97706', name: 'Amber' },
  { color: '#7c3aed', name: 'Violet' },
  { color: '#db2777', name: 'Pink' },
  { color: '#0f766e', name: 'Teal' },
];

const MAX_LOGO_BYTES = 1.5 * 1024 * 1024;

interface SettingsForm {
  companyName: string;
  tagline: string;
  gstin: string;
  stateCode: string;
  phone: string;
  email: string;
  address: string;
  logoDataUri: string | null;
  accentColor: string;
  defaultTaxPercent: string;
  defaultGstType: string;
  lowStockThreshold: string;
  invoicePrefix: string;
}

const EMPTY_FORM: SettingsForm = {
  companyName: '',
  tagline: '',
  gstin: '',
  stateCode: '',
  phone: '',
  email: '',
  address: '',
  logoDataUri: null,
  accentColor: '#4f46e5',
  defaultTaxPercent: '18',
  defaultGstType: 'IGST',
  lowStockThreshold: '10',
  invoicePrefix: '',
};

export function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<SettingsForm>(EMPTY_FORM);
  const [logoError, setLogoError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  // Initialize form state from settings once loaded
  useEffect(() => {
    if (!settings) return;
    setForm({
      companyName: settings.companyName ?? '',
      tagline: settings.tagline ?? '',
      gstin: settings.gstin ?? '',
      stateCode: settings.stateCode ?? '',
      phone: settings.phone ?? '',
      email: settings.email ?? '',
      address: settings.address ?? '',
      logoDataUri: settings.logoDataUri ?? null,
      accentColor: settings.accentColor ?? '#4f46e5',
      defaultTaxPercent: settings.defaultTaxPercent != null ? String(settings.defaultTaxPercent) : '18',
      defaultGstType: settings.defaultGstType ?? 'IGST',
      lowStockThreshold: settings.lowStockThreshold != null ? String(settings.lowStockThreshold) : '10',
      invoicePrefix: settings.invoicePrefix ?? '',
    });
  }, [settings]);

  function set<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function pickAccent(color: string) {
    set('accentColor', color);
    // Immediate live preview across the app
    document.documentElement.style.setProperty('--accent', color);
  }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError('');
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Image is too large — please choose a file under 1.5 MB.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set('logoDataUri', reader.result as string);
    reader.onerror = () => setLogoError('Could not read the selected file. Please try another image.');
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    set('logoDataUri', null);
    setLogoError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError('');
    setSaved(false);
    try {
      await update.mutateAsync({
        ...form,
        defaultTaxPercent: Number(form.defaultTaxPercent) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 0,
      });
      setSaved(true);
    } catch (err: any) {
      setSaveError(err?.response?.data?.error ?? 'Failed to save settings');
    }
  }

  async function seedDemo() {
    setSeeding(true);
    setSeedMessage('');
    try {
      const res = await api.post('/settings/seed-demo');
      setSeedMessage(res.data?.message ?? 'Demo data loaded.');
    } catch (err: any) {
      setSeedMessage(err?.response?.data?.error ?? err?.response?.data?.message ?? 'Failed to load demo data.');
    } finally {
      setSeeding(false);
    }
  }

  if (isLoading) {
    return <p className="text-gray-400">Loading settings…</p>;
  }

  return (
    <div className="max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Company profile, branding and application defaults</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Company Profile ─────────────────────────────────────────── */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Company Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label className="label">Company Name</label>
              <input type="text" className="input" value={form.companyName}
                onChange={(e) => set('companyName', e.target.value)} placeholder="Shakti Gold Furniture" />
            </div>
            <div className="form-field">
              <label className="label">Tagline</label>
              <input type="text" className="input" value={form.tagline}
                onChange={(e) => set('tagline', e.target.value)} placeholder="Steel & Furniture ERP" />
            </div>
            <div className="form-field">
              <label className="label">GSTIN</label>
              <input type="text" className="input" value={form.gstin}
                onChange={(e) => set('gstin', e.target.value)} placeholder="15-char GSTIN" maxLength={15} />
            </div>
            <div className="form-field">
              <label className="label">State Code</label>
              <input type="text" className="input" value={form.stateCode}
                onChange={(e) => set('stateCode', e.target.value)} placeholder="e.g. 03" maxLength={2} />
            </div>
            <div className="form-field">
              <label className="label">Phone</label>
              <input type="text" className="input" value={form.phone}
                onChange={(e) => set('phone', e.target.value)} placeholder="+91 …" />
            </div>
            <div className="form-field">
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email}
                onChange={(e) => set('email', e.target.value)} placeholder="office@example.com" />
            </div>
            <div className="form-field md:col-span-2">
              <label className="label">Address</label>
              <input type="text" className="input" value={form.address}
                onChange={(e) => set('address', e.target.value)} placeholder="Street, area, city, PIN" />
            </div>
          </div>
        </div>

        {/* ── Branding ────────────────────────────────────────────────── */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Branding</h2>

          <div className="flex items-start gap-5">
            <Logo logoDataUri={form.logoDataUri} size={80} />
            <div className="flex-1">
              <label className="label">Company Logo</label>
              <p className="text-xs text-gray-400 mb-2">
                Square images look best. Max 1.5 MB. Without a logo, the default SGF monogram is used.
              </p>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFile}
                  className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-slate-200 file:cursor-pointer"
                />
                {form.logoDataUri && (
                  <button type="button" onClick={removeLogo} className="btn-secondary text-xs px-3 py-1.5">
                    Remove logo
                  </button>
                )}
              </div>
              {logoError && <p className="text-red-500 text-sm mt-2">{logoError}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="label">Accent Color</label>
            <p className="text-xs text-gray-400 mb-2">Used for buttons, active navigation and highlights across the app.</p>
            <div className="flex items-center gap-2 flex-wrap">
              {ACCENT_PRESETS.map(({ color, name }) => (
                <button
                  key={color}
                  type="button"
                  title={name}
                  aria-label={`Accent color ${name}`}
                  onClick={() => pickAccent(color)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    form.accentColor?.toLowerCase() === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ background: color }}
                />
              ))}
              <input
                type="color"
                value={form.accentColor || '#4f46e5'}
                onChange={(e) => pickAccent(e.target.value)}
                title="Custom accent color"
                className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer p-0 bg-white"
              />
              <span className="text-xs font-mono text-gray-500 ml-1">{form.accentColor}</span>
            </div>
          </div>
        </div>

        {/* ── Defaults & Preferences ──────────────────────────────────── */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Defaults &amp; Preferences</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="form-field">
              <label className="label">Default Tax %</label>
              <input type="number" className="input" min={0} max={28} step="0.01"
                value={form.defaultTaxPercent}
                onChange={(e) => set('defaultTaxPercent', e.target.value)} />
            </div>
            <div className="form-field">
              <label className="label">Default GST Type</label>
              <select className="input" value={form.defaultGstType}
                onChange={(e) => set('defaultGstType', e.target.value)}>
                <option value="IGST">IGST</option>
                <option value="CGST+SGST">CGST + SGST</option>
                <option value="NONE">None</option>
              </select>
            </div>
            <div className="form-field">
              <label className="label">Low Stock Threshold</label>
              <input type="number" className="input" min={0}
                value={form.lowStockThreshold}
                onChange={(e) => set('lowStockThreshold', e.target.value)} />
            </div>
            <div className="form-field">
              <label className="label">Invoice Prefix</label>
              <input type="text" className="input" value={form.invoicePrefix}
                onChange={(e) => set('invoicePrefix', e.target.value)} placeholder="e.g. SGF" />
            </div>
          </div>
        </div>

        {/* ── Demo Data ───────────────────────────────────────────────── */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Demo Data</h2>
          <p className="text-xs text-gray-400 mb-4">
            Load a set of sample parties, items and transactions to explore the app.
            Demo data only loads when the database is empty — existing data is never touched.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button type="button" onClick={seedDemo} disabled={seeding} className="btn-secondary">
              {seeding ? 'Loading…' : 'Load Demo Data'}
            </button>
            {seedMessage && <span className="text-sm text-gray-600">{seedMessage}</span>}
          </div>
        </div>

        {/* ── Save ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={update.isPending}>
            {update.isPending ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && <span className="text-emerald-600 text-sm font-medium">Saved ✓</span>}
          {saveError && <span className="text-red-500 text-sm">{saveError}</span>}
        </div>
      </form>
    </div>
  );
}
