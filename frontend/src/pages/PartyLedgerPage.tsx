import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePartyLedger } from '../api/hooks';
import { FySelector } from '../components/FySelector';

export function PartyLedgerPage() {
  const { id } = useParams<{ id: string }>();
  const [fy, setFy] = useState('2026-27');
  const { data, isLoading } = usePartyLedger(Number(id), fy);

  const finalBalance = data?.ledger?.at(-1)?.runningBalance ?? '0';
  const totalSales = data?.ledger?.filter((r: any) => r.type === 'SALE').reduce((s: number, r: any) => s + parseFloat(r.debit || 0), 0) ?? 0;
  const totalReturns = data?.ledger?.filter((r: any) => r.type === 'RETURN').reduce((s: number, r: any) => s + parseFloat(r.credit || 0), 0) ?? 0;
  const totalPayments = data?.ledger?.filter((r: any) => r.type === 'PAYMENT').reduce((s: number, r: any) => s + parseFloat(r.credit || 0), 0) ?? 0;

  const typeStyle: Record<string, string> = {
    SALE: 'badge-orange',
    RETURN: 'badge-green',
    PAYMENT: 'badge-blue',
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <Link to="/parties" className="btn-secondary text-xs px-3 py-1.5">← Parties</Link>
          <div>
            <h1 className="page-title">{data?.party?.name ?? 'Loading…'}</h1>
            <p className="page-subtitle">{data?.party?.city} · {data?.party?.gstin ?? 'No GSTIN'}</p>
          </div>
        </div>
        <FySelector value={fy} onChange={setFy} />
      </div>

      {/* Summary cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="kpi-card">
            <span className="kpi-label">Total Sales</span>
            <span className="kpi-value text-indigo-600">₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Returns</span>
            <span className="kpi-value text-orange-500">₹{totalReturns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Total Paid</span>
            <span className="kpi-value text-green-600">₹{totalPayments.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className={`kpi-card border-2 ${parseFloat(finalBalance) > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <span className="kpi-label">Outstanding</span>
            <span className={`kpi-value ${parseFloat(finalBalance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{parseFloat(finalBalance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-gray-500">{parseFloat(finalBalance) > 0 ? 'Amount owed to you' : 'Credit balance'}</span>
          </div>
        </div>
      )}

      {/* Ledger table */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? <p className="p-5 text-gray-400">Loading ledger…</p> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th><th>Type</th><th>Description</th>
                  <th className="text-right">Debit (Sale)</th>
                  <th className="text-right">Credit (Ret/Pay)</th>
                  <th className="text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {data?.ledger?.map((row: any, i: number) => (
                  <tr key={i}>
                    <td className="text-gray-500">{row.date?.slice(0, 10)}</td>
                    <td><span className={`badge ${typeStyle[row.type] ?? 'badge-gray'}`}>{row.type}</span></td>
                    <td className="text-sm">{row.description}</td>
                    <td className="text-right font-mono text-indigo-700">
                      {parseFloat(row.debit) > 0 ? `₹${parseFloat(row.debit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : ''}
                    </td>
                    <td className="text-right font-mono text-green-700">
                      {parseFloat(row.credit) > 0 ? `₹${parseFloat(row.credit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : ''}
                    </td>
                    <td className={`text-right font-mono font-semibold ${parseFloat(row.runningBalance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{parseFloat(row.runningBalance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
