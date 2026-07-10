import { useState } from 'react';
import { useInventoryStatus, usePartyBalances, useSalesAnalysis } from '../api/hooks';
import { FySelector } from '../components/FySelector';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardPage() {
  const [fy, setFy] = useState('2026-27');
  const { data: stock = [] } = useInventoryStatus(fy);
  const { data: balances = [] } = usePartyBalances(fy);
  const { data: salesByItem = [] } = useSalesAnalysis({ fyYear: fy, groupBy: 'item' });

  const lowStock = stock.filter((s: any) => parseFloat(s.onHand) < 10);
  const totalOutstanding = balances.reduce((sum: number, p: any) => sum + parseFloat(p.outstanding), 0);
  const totalSales = balances.reduce((sum: number, p: any) => sum + parseFloat(p.totalSales), 0);
  const totalCollected = balances.reduce((sum: number, p: any) => sum + parseFloat(p.totalPayments), 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Financial Year {fy} Overview</p>
        </div>
        <FySelector value={fy} onChange={setFy} />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card">
          <span className="kpi-label">Total Sales</span>
          <span className="kpi-value text-indigo-600">₹{(totalSales / 100000).toFixed(2)}L</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Total Collected</span>
          <span className="kpi-value text-green-600">₹{(totalCollected / 100000).toFixed(2)}L</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Outstanding</span>
          <span className="kpi-value text-red-500">₹{(totalOutstanding / 100000).toFixed(2)}L</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Low Stock Items</span>
          <span className={`kpi-value ${lowStock.length > 0 ? 'text-orange-500' : 'text-gray-500'}`}>{lowStock.length}</span>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <h2 className="font-semibold text-orange-800 text-sm mb-3">Low Stock Alert — items below 10 units</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lowStock.map((s: any) => (
              <div key={s.id} className="bg-white rounded-xl border border-orange-200 p-3">
                <span className="badge badge-orange mb-1">{s.code}</span>
                <div className="text-sm font-medium mt-1">{s.name}</div>
                <div className="text-orange-600 font-bold text-lg">{parseFloat(s.onHand).toFixed(0)} units</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts + party balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Sales by Item (Qty)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salesByItem.slice(0, 12)}>
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={55} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => [parseFloat(v).toFixed(0), 'Qty']} />
              <Bar dataKey="quantity" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Party Outstanding Balances</h2>
          </div>
          <div className="overflow-auto max-h-72">
            <table className="data-table">
              <thead>
                <tr><th>Party</th><th>City</th><th className="text-right">Sales</th><th className="text-right">Outstanding</th></tr>
              </thead>
              <tbody>
                {[...balances].sort((a: any, b: any) => parseFloat(b.outstanding) - parseFloat(a.outstanding)).map((p: any) => (
                  <tr key={p.id}>
                    <td className="font-medium text-sm">{p.name}</td>
                    <td className="text-gray-400 text-xs">{p.city}</td>
                    <td className="text-right font-mono text-xs">₹{parseFloat(p.totalSales).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className={`text-right font-mono font-semibold text-sm ${parseFloat(p.outstanding) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{parseFloat(p.outstanding).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
