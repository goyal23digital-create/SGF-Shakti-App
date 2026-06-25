import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePartyLedger } from '../api/hooks';
import { FySelector } from '../components/FySelector';

export function PartyLedgerPage() {
  const { id } = useParams<{ id: string }>();
  const [fy, setFy] = useState('2026-27');
  const { data, isLoading } = usePartyLedger(Number(id), fy);

  const finalBalance = data?.ledger?.at(-1)?.runningBalance ?? '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/parties" className="text-gray-400 hover:text-gray-700 text-sm">← Parties</Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{data?.party?.name ?? 'Loading…'}</h1>
          <p className="text-gray-500 text-sm">{data?.party?.city}</p>
        </div>
        <FySelector value={fy} onChange={setFy} />
      </div>

      {data && (
        <div className={`rounded-xl border p-4 text-center ${parseFloat(finalBalance) > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className="text-sm text-gray-600">Outstanding Balance</div>
          <div className={`text-3xl font-bold ${parseFloat(finalBalance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ₹{parseFloat(finalBalance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-gray-400 mt-1">{parseFloat(finalBalance) > 0 ? 'Amount owed to you' : 'Credit balance'}</div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
        {isLoading ? <p className="p-4 text-gray-400">Loading…</p> : (
          <table className="table-grid">
            <thead>
              <tr><th>Date</th><th>Type</th><th>Description</th><th className="text-right">Debit (Sale)</th><th className="text-right">Credit (Ret/Pay)</th><th className="text-right">Balance</th></tr>
            </thead>
            <tbody>
              {data?.ledger?.map((row: any, i: number) => (
                <tr key={i}>
                  <td>{row.date?.slice(0, 10)}</td>
                  <td><span className={`text-xs px-1.5 py-0.5 rounded ${row.type === 'SALE' ? 'bg-orange-100 text-orange-800' : row.type === 'PAYMENT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{row.type}</span></td>
                  <td className="text-sm">{row.description}</td>
                  <td className="text-right font-mono">{parseFloat(row.debit) > 0 ? `₹${parseFloat(row.debit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : ''}</td>
                  <td className="text-right font-mono text-green-700">{parseFloat(row.credit) > 0 ? `₹${parseFloat(row.credit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : ''}</td>
                  <td className={`text-right font-mono font-semibold ${parseFloat(row.runningBalance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{parseFloat(row.runningBalance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
