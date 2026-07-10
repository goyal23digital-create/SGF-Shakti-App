import { useState } from 'react';
import { useInventoryStatus, useSalesAnalysis, useProductionAnalysis, useExpenseSummary } from '../api/hooks';
import { FySelector } from '../components/FySelector';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f97316', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b'];

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
    { key: 'production', label: 'Production' },
    { key: 'expenses', label: 'Expense Summary' },
  ] as const;

  const totalOnHand = stock.reduce((s: number, r: any) => s + parseFloat(r.onHand || 0), 0);
  const totalSalesValue = salesByItem.reduce((s: number, r: any) => s + parseFloat(r.value || 0), 0);
  const totalProduction = production.reduce((s: number, r: any) => s + parseFloat(r.quantity || 0), 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Financial Year {fy}</p>
        </div>
        <FySelector value={fy} onChange={setFy} />
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>{label}</button>
        ))}
      </div>

      {tab === 'stock' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="kpi-card"><span className="kpi-label">Total Items</span><span className="kpi-value text-indigo-600">{stock.length}</span></div>
            <div className="kpi-card"><span className="kpi-label">Total On Hand</span><span className="kpi-value text-green-600">{totalOnHand.toLocaleString('en-IN', { maximumFractionDigits: 0 })} units</span></div>
            <div className="kpi-card"><span className="kpi-label">Low Stock</span><span className="kpi-value text-orange-500">{stock.filter((s: any) => parseFloat(s.onHand) < 10).length} items</span></div>
          </div>
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Stock on Hand by Item</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stock.filter((s: any) => parseFloat(s.onHand) !== 0)}>
                <XAxis dataKey="code" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => [parseFloat(v).toFixed(0), 'Units']} />
                <Bar dataKey="onHand" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="data-table">
              <thead><tr><th>Code</th><th>Item</th><th className="text-right">In</th><th className="text-right">Out</th><th className="text-right">Returns</th><th className="text-right">On Hand</th></tr></thead>
              <tbody>
                {stock.map((s: any) => (
                  <tr key={s.id}>
                    <td><span className="badge badge-blue">{s.code}</span></td>
                    <td className="font-medium">{s.name}</td>
                    <td className="text-right font-mono">{parseFloat(s.inQty).toFixed(0)}</td>
                    <td className="text-right font-mono">{parseFloat(s.outQty).toFixed(0)}</td>
                    <td className="text-right font-mono">{parseFloat(s.returnQty).toFixed(0)}</td>
                    <td className={`text-right font-mono font-bold ${parseFloat(s.onHand) < 10 ? 'text-red-600' : 'text-green-600'}`}>{parseFloat(s.onHand).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sales' && (
        <div className="space-y-4">
          <div className="kpi-card inline-flex flex-col">
            <span className="kpi-label">Total Sales Value</span>
            <span className="kpi-value text-indigo-600">₹{totalSalesValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Sales Value by Item</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={salesByItem.slice(0, 12)}>
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={55} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => [`₹${parseFloat(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 'Value']} />
                  <Bar dataKey="value" fill="#6366f1" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Sales by Party</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={salesByParty.slice(0, 8)} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={85}
                    label={({ label, percent }: any) => `${label.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {salesByParty.slice(0, 8).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`₹${parseFloat(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="data-table">
              <thead><tr><th>Party</th><th className="text-right">Sales Value (₹)</th><th className="text-right">Qty</th></tr></thead>
              <tbody>
                {[...salesByParty].sort((a: any, b: any) => parseFloat(b.value) - parseFloat(a.value)).map((r: any) => (
                  <tr key={r.key}>
                    <td className="font-medium">{r.label}</td>
                    <td className="text-right font-mono">₹{parseFloat(r.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="text-right">{parseFloat(r.quantity).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'production' && (
        <div className="space-y-4">
          <div className="kpi-card inline-flex flex-col">
            <span className="kpi-label">Total Production</span>
            <span className="kpi-value text-green-600">{totalProduction.toLocaleString('en-IN', { maximumFractionDigits: 0 })} units</span>
          </div>
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Production by Item</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={production}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={55} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#22c55e" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="data-table">
              <thead><tr><th>Item</th><th className="text-right">Qty Produced</th></tr></thead>
              <tbody>{production.map((r: any) => (
                <tr key={r.key}><td className="font-medium">{r.label}</td><td className="text-right font-mono">{parseFloat(r.quantity).toFixed(0)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'expenses' && expenseData && (
        <div className="space-y-4">
          <div className="kpi-card inline-flex flex-col border-red-200">
            <span className="kpi-label">Total Expenses</span>
            <span className="kpi-value text-red-600">₹{parseFloat(expenseData.grandTotal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Expense by Category</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={expenseData.summary} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={90}
                    label={({ category, percent }: any) => `${category.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {expenseData.summary.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`₹${parseFloat(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Category Breakdown</h2>
              <div className="space-y-2">
                {expenseData.summary.map((r: any, i: number) => (
                  <div key={r.category} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }}></div>
                      <span className="text-sm">{r.category}</span>
                    </div>
                    <span className="font-mono text-sm font-semibold">₹{parseFloat(r.total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
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
