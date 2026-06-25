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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <FySelector value={fy} onChange={setFy} />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Sales" value={`₹${(totalSales / 100000).toFixed(1)}L`} color="text-green-600" />
        <KpiCard label="Outstanding" value={`₹${(totalOutstanding / 100000).toFixed(1)}L`} color="text-red-600" />
        <KpiCard label="Active Parties" value={String(balances.length)} color="text-blue-600" />
        <KpiCard label="Low Stock Items" value={String(lowStock.length)} color={lowStock.length > 0 ? 'text-orange-600' : 'text-gray-600'} />
      </div>

      {/* Sales by item chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold mb-3">Sales by Item (Qty)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={salesByItem.slice(0, 15)}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#f97316" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h2 className="font-semibold text-orange-800 mb-2">Low Stock Alert</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {lowStock.map((s: any) => (
              <div key={s.id} className="bg-white rounded border border-orange-200 p-2 text-sm">
                <div className="font-medium">{s.code}</div>
                <div className="text-gray-500 text-xs">{s.name}</div>
                <div className="text-orange-600 font-bold">{s.onHand} units</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Party balances */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold mb-3">Party Outstanding Balances</h2>
        <div className="overflow-auto max-h-64">
          <table className="table-grid">
            <thead>
              <tr>
                <th>Party</th><th>City</th><th className="text-right">Sales</th><th className="text-right">Returns</th><th className="text-right">Payments</th><th className="text-right">Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {balances.sort((a: any, b: any) => parseFloat(b.outstanding) - parseFloat(a.outstanding)).map((p: any) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td className="text-gray-500">{p.city}</td>
                  <td className="text-right">₹{parseFloat(p.totalSales).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className="text-right text-green-600">₹{parseFloat(p.totalReturns).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className="text-right text-blue-600">₹{parseFloat(p.totalPayments).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className={`text-right font-semibold ${parseFloat(p.outstanding) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{parseFloat(p.outstanding).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}
