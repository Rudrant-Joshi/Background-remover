import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useQuery } from '@tanstack/react-query'
import { getSubscription, getCredits, getTransactions } from '../../services/supabase.service'
import { formatDate, formatCurrency } from '../../lib/utils'
import { CreditCard, Award, ArrowUpRight, History, Calendar, Star } from 'lucide-react'

export default function BillingPage() {
  const { user } = useAuthStore()

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: () => getSubscription(user.id),
    enabled: !!user?.id,
  })

  const { data: credits } = useQuery({
    queryKey: ['credits', user?.id],
    queryFn: () => getCredits(user.id),
    enabled: !!user?.id,
  })

  const { data: transactions } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => getTransactions(user.id),
    enabled: !!user?.id,
  })

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-white">Billing & Plan</h1>
          <p className="text-sm text-text-secondary mt-1">Manage subscription billing, check invoices, and review plan tiers.</p>
        </div>
        <Link to="/pricing" className="btn-primary flex items-center gap-1 text-xs">
          Upgrade Plan <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Subscription Active Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier Details Card */}
        <div className="card p-6 bg-card border-card-border flex flex-col justify-between gap-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="badge badge-primary font-bold text-xs uppercase w-fit">Current Plan</span>
              <h3 className="text-xl font-bold text-white mt-1.5 capitalize">{credits?.plan || 'Free'} Subscription</h3>
              <p className="text-xs text-text-muted">
                {credits?.plan === 'pro' 
                  ? 'Unlimited high-resolution downloads, prior queue priority access.' 
                  : 'Daily quota limited to 5 image removals. Upgrades activate instantly.'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Award className="h-6 w-6" />
            </div>
          </div>

          <div className="divider" />

          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-text-muted" /> Renewal Date</span>
            <span className="font-bold text-white">
              {subscription?.current_period_end ? formatDate(subscription.current_period_end) : 'N/A (Free plan)'}
            </span>
          </div>
        </div>

        {/* Quota details card */}
        <div className="card p-6 bg-card border-card-border flex flex-col justify-between gap-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-muted font-medium">Credits Usage Daily Limit</span>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">
                {credits ? (credits.plan === 'pro' ? 'Unlimited' : (credits.total_credits - credits.used_credits)) : '...'}
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Daily limits reset at 00:00 UTC. Unused plan credits do not roll over.
              </p>
            </div>
          </div>

          <div className="w-full bg-black h-2 rounded-full overflow-hidden mt-2">
            {credits && credits.plan !== 'pro' && (
              <div 
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (credits.used_credits / credits.total_credits) * 100)}%` }}
              />
            )}
            {credits?.plan === 'pro' && (
              <div className="bg-success h-full rounded-full w-full" />
            )}
          </div>
        </div>
      </div>

      {/* Transaction billing histories */}
      <div className="card p-6 bg-card border-card-border">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-primary" /> Invoice & Billing History
        </h2>

        {subLoading ? (
          <div className="skeleton h-20 w-full" />
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-muted">
            No invoicing or payment logs associated with this account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-card-border text-text-muted font-semibold">
                  <th className="py-2.5">Billing ID</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Plan Purchased</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="table-row">
                    <td className="py-3 font-mono text-xs text-text-secondary truncate max-w-[120px]">{tx.razorpay_payment_id || tx.id}</td>
                    <td className="py-3 text-text-muted">{formatDate(tx.created_at)}</td>
                    <td className="py-3 font-semibold text-white capitalize">{tx.plan || 'Credits Pack'}</td>
                    <td className="py-3 font-bold text-primary">{formatCurrency(tx.amount)}</td>
                    <td className="py-3 text-right">
                      <span className={`badge uppercase text-[8px] font-bold ${
                        tx.status === 'completed' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
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
