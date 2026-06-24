import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useQuery } from '@tanstack/react-query'
import { getUploads, getCredits, getSubscription } from '../../services/supabase.service'
import { getLocalUploads } from '../../services/localDb.service'
import { formatBytes, formatRelativeTime } from '../../lib/utils'
import { 
  UploadCloud, 
  Clock, 
  Database, 
  Sparkles, 
  AlertCircle, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  LogOut,
  Eye
} from 'lucide-react'

export default function DashboardPage() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  // Fetch recent uploads (7 days limit, merged with local storage)
  const { data: uploads, isLoading: uploadsLoading } = useQuery({
    queryKey: ['uploads', user?.id],
    queryFn: async () => {
      let remoteUploads = []
      try {
        remoteUploads = await getUploads(user.id, 7)
      } catch (err) {
        console.warn('Failed to fetch remote uploads:', err)
      }

      let localUploads = []
      try {
        localUploads = await getLocalUploads(user.id)
      } catch (err) {
        console.error('Failed to fetch local uploads:', err)
      }

      const mergedMap = new Map()

      // Add remote uploads first
      remoteUploads.forEach(record => {
        mergedMap.set(record.id, record)
      })

      // Overlay local uploads, favoring remote database URLs if they exist
      localUploads.forEach(record => {
        const existing = mergedMap.get(record.id)
        if (existing) {
          mergedMap.set(record.id, {
            ...existing,
            result_url: existing.result_url || record.result_url,
            original_url: existing.original_url || record.original_url,
            status: existing.status || record.status,
          })
        } else {
          mergedMap.set(record.id, record)
        }
      })

      const mergedList = Array.from(mergedMap.values())
      mergedList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      return mergedList
    },
    enabled: !!user?.id,
  })

  // Fetch credits
  const { data: credits } = useQuery({
    queryKey: ['credits', user?.id],
    queryFn: () => getCredits(user.id),
    enabled: !!user?.id,
  })

  // Fetch subscription
  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: () => getSubscription(user.id),
    enabled: !!user?.id,
  })

  const stats = [
    {
      label: 'Credits Remaining',
      value: credits ? (credits.plan === 'pro' ? 'Unlimited' : (credits.total_credits - credits.used_credits)) : '...',
      detail: credits?.plan === 'pro' ? 'Pro Plan active' : `${credits?.used_credits || 0} / ${credits?.total_credits || 5} credits used`,
      icon: Sparkles,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      label: 'Uploads (7 days)',
      value: uploads ? uploads.length : '...',
      detail: 'Recent background removals',
      icon: Clock,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      label: 'Active Plan',
      value: credits?.plan ? (credits.plan.charAt(0).toUpperCase() + credits.plan.slice(1)) : 'Free',
      detail: subscription?.status === 'active' ? 'Renews automatically' : 'Daily limit applies',
      icon: CreditCard,
      color: 'text-success bg-success/10 border-success/20',
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-white">Overview Workspace</h1>
          <p className="text-sm text-text-secondary mt-1">Manage background removals, check credits, and view recent history.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleLogout}
            className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 md:py-3 md:px-6 text-xs md:text-sm border-error/20 hover:bg-error/10 hover:text-error hover:border-error/30 transition-all duration-200"
            id="dashboard-logout-button"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <Link to="/upload" className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 md:py-3.5 md:px-7 text-xs md:text-sm">
            <UploadCloud className="h-4 w-4" />
            Remove Background
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="card p-6 flex items-start gap-4 hover:scale-[1.03] hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 cursor-default">
              <div className={`p-3 rounded-lg border ${stat.color} shrink-0`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted font-medium">{stat.label}</span>
                <span className="text-2xl font-extrabold text-white mt-1">{stat.value}</span>
                <span className="text-xs text-text-secondary mt-1.5">{stat.detail}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Uploads History */}
      <div className="card p-6 bg-card border-card-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-primary" />
            Recent Upload Workspace (7 days)
          </h2>
          <Link to="/downloads" className="text-xs text-primary hover:text-primary-hover font-semibold flex items-center gap-1">
            View all history <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {uploadsLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton h-16 w-full" />
            ))}
          </div>
        ) : !uploads || uploads.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center gap-3 border border-dashed border-card-border rounded-xl bg-background-secondary">
            <AlertCircle className="h-8 w-8 text-text-muted" />
            <span className="text-sm font-semibold text-text-secondary">No background removals yet.</span>
            <Link to="/upload" className="btn-secondary py-1.5 px-4 text-xs font-semibold mt-2">
              Start first removal
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-card-border text-text-muted font-semibold">
                  <th className="py-2.5">Image</th>
                  <th className="py-2.5">Filename</th>
                  <th className="py-2.5">File Size</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {uploads.slice(0, 5).map((upload) => (
                  <tr key={upload.id} className="table-row">
                    <td className="py-3">
                      {upload.status === 'completed' ? (
                        <Link 
                          to={`/preview/${upload.id}`}
                          className="relative h-11 w-11 rounded-lg overflow-hidden border border-card-border flex items-center justify-center group cursor-pointer block"
                          style={{ backgroundImage: "radial-gradient(circle, #222222 10%, transparent 11%)", backgroundSize: "6px 6px", backgroundColor: "#0A0A0A" }}
                          title="View Result"
                        >
                          <img src={upload.result_url} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110" alt="cutout" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <Eye className="h-4.5 w-4.5 text-white" />
                          </div>
                        </Link>
                      ) : (
                        <div className="h-11 w-11 rounded-lg overflow-hidden border border-card-border bg-background-secondary flex items-center justify-center relative">
                          <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">
                            {upload.status === 'failed' ? 'Failed' : 'Processing'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 font-medium text-white max-w-[200px] truncate">{upload.original_filename || 'image.png'}</td>
                    <td className="py-3 text-text-muted">{formatBytes(upload.file_size)}</td>
                    <td className="py-3 text-text-muted">{formatRelativeTime(upload.created_at)}</td>
                    <td className="py-3 text-right">
                      {upload.status === 'completed' ? (
                        <Link to={`/preview/${upload.id}`} className="btn-secondary py-1 px-3 text-xs font-semibold">
                          View & Download
                        </Link>
                      ) : (
                        <span className="badge badge-warning text-[10px] uppercase font-bold">{upload.status}</span>
                      )}
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
