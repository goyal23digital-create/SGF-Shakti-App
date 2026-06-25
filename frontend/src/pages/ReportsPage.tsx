import { useState } from 'react';
import { useInventoryStatus, useSalesAnalysis, useProductionAnalysis, useExpenseSummary } from '../api/hooks';
import { FySelector } from '../components/FySelector';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1'];

export function ReportsPage() {
  const [fy, setFy] = useState('2026-27');
  const [tab, setTab] = useState<'stock' | 'sales' | 'production' | 'expenses'>('stock');

  const { data: stock = [] } = useInventoryStatus(fy);
  const { data: salesByItem = [] } = useSalesAnalysis({ fyYear: fy, groupBy: 'item' });
  const { data: salesByParty = [] } = useSalesAnalysis({ fyYear: fy, groupBy: 'party' });
  const { data: production = [] } = useProductionAnalysis({ fyYear: fy });
  const { data: expenseData } = useExpenseSummary({ fyYear: fy });

  const tabs = [
    { key: 'stock', label: 'Inventory Status' },
    { key: 'sales', label: 'Sales Analysis' },
    { key: 'production', label: 'Production Analysis' },
    { key: 'expenses', label: 'Expense Summary' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <FySelector value={fy} onChange={setFy} />
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === key ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>{label}</button>
        ))}
      </div>

      {tab === 'stock' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold mb-3">Stock on Hand by Item</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stock.filter((s: any) => parseFloat(s.onHand) !== 0)}>
                <XAxis dataKey="code" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => [parseFloat(v).toFixed(0), 'Units']} />
                <Bar dataKey="onHand" fill="#f97316" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
            <table className="table-grid">
              <thead><tr><th>Code</th><th>Item</th><th className="text-right">In</th><th className="text-right">Out</th><th className="text-right">Returns</th><th className="text-right">On Hand</th></tr></thead>
              <tbody>
                {stock.map((s: any) => (
                  <tr key={s.id}>
                    <td className="font-mono font-bold">{s.code}</td>
                    <td>{s.name}</td>
                    <td className="text-right">{parseFloat(s.inQty).toFixed(0)}</td>
                    <td className="text-right">{parseFloat(s.outQty).toFixed(0)}</td>
                    <td className="text-right">{parseFloat(s.returnQty).toFixed(0)}</td>
                    <td className={`text-right font-bold ${parseFloat(s.onHand) < 10 ? 'text-red-600' : 'text-green-700'}`}>{parseFloat(s.onHand).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold mb-3">Sales Value by Item</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={salesByItem.slice(0, 12)}>
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => [`₹${parseFloat(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 'Value']} />
                  <Bar dataKey="value" fill="#f97316" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold mb-3">Sales by Party</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={salesByParty.slice(0, 8)} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ label, percent }: any) => `${label.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {salesByParty.slice(0, 8).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`₹${parseFloat(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
            <table className="table-grid">
              <thead><tr><th>Party</th><th className="text-right">Sales Value (₹)</th><th className="text-right">Qty</th></tr></thead>
              <tbody>
                {salesByParty.sort((a: any, b: any) => parseFloat(b.value) - parseFloat(a.value)).map((r: any) => (
                  <tr key={r.key}><td>{r.label}</td><td className="text-right font-mono">₹{parseFloat(r.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td><td className="text-right">{parseFloat(r.quantity).toFixed(0)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'production' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold mb-3">Production by Item</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={production}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
            <table className="table-grid">
              <thead><tr><th>Item</th><th className="text-right">Qty Produced</th></tr></thead>
              <tbody>{production.map((r: any) => <tr key={r.key}><td>{r.label}</td><td className="text-right font-mono">{parseFloat(r.quantity).toFixed(0)}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'expenses' && expenseData && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold mb-3">Expense by Category</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={expenseData.summary} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={90} label={({ category, percent }: any) => `${category.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {expenseData.summary.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`₹${parseFloat(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold mb-1">Summary</h2>
              <div className="text-3xl font-bold text-red-600 mb-4">₹{parseFloat(expenseData.grandTotal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              <div className="space-y-1">
                {expenseData.summary.map((r: any) => (
                  <div key={r.category} className="flex justify-between text-sm">
                    <span>{r.category}</span>
                    <span className="font-mono">₹{parseFloat(r.total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
