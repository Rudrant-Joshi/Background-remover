import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllTransactions } from '../../services/supabase.service'
import { formatDate, formatCurrency } from '../../lib/utils'
import { Wallet, RefreshCw } from 'lucide-react'

export default function AdminPayments() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: () => getAllTransactions(1, 20),
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Payment & Billing Logs</h1>
        <p className="text-sm text-text-secondary mt-1">Review all verified transactions, checkout intents, subscription logs, and refunds.</p>
      </div>

      <div className="card p-6 bg-card border-card-border">
        <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <Wallet className="h-4.5 w-4.5 text-warning" /> Authorized Razorpay Purchases
        </h2>

        {isLoading ? (
          <div className="skeleton h-24 w-full" />
        ) : !data?.data || data.data.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-muted">
            No invoicing ledger items stored.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-card-border text-text-muted font-semibold">
                  <th className="py-2.5">User Email</th>
                  <th className="py-2.5">Razorpay Order ID</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((tx) => (
                  <tr key={tx.id} className="table-row">
                    <td className="py-3 font-semibold text-white">{tx.profiles?.email || 'N/A'}</td>
                    <td className="py-3 font-mono text-xs text-text-secondary">{tx.razorpay_order_id || 'N/A'}</td>
                    <td className="py-3 text-primary font-bold">{formatCurrency(tx.amount)}</td>
                    <td className="py-3">
                      <span className={`badge uppercase text-[8px] font-bold ${
                        tx.status === 'completed' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-text-muted">{formatDate(tx.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
