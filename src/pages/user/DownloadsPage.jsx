import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useQuery } from '@tanstack/react-query'
import { getUploads } from '../../services/supabase.service'
import { getLocalUploads } from '../../services/localDb.service'
import { formatBytes, formatDate } from '../../lib/utils'
import { Download, AlertCircle, RefreshCw, FileSpreadsheet, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function DownloadsPage() {
  const { user } = useAuthStore()

  const handleDownload = async (upload) => {
    if (!upload?.result_url) return
    try {
      const response = await fetch(upload.result_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `transparent_${upload.original_filename || 'result.png'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Download started!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to trigger download. Opening image in new tab.')
      window.open(upload.result_url, '_blank')
    }
  }

  const { data: uploads, isLoading } = useQuery({
    queryKey: ['uploads-full', user?.id],
    queryFn: async () => {
      let remoteUploads = []
      try {
        remoteUploads = await getUploads(user.id, 30)
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Download History</h1>
        <p className="text-sm text-text-secondary mt-1">Access all your completed background removals from the past 30 days.</p>
      </div>

      <div className="card p-6 bg-card border-card-border">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton h-16 w-full" />
            ))}
          </div>
        ) : !uploads || uploads.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center gap-3">
            <AlertCircle className="h-8 w-8 text-text-muted" />
            <span className="text-sm font-semibold text-text-secondary">No downloads history found.</span>
            <Link to="/upload" className="btn-primary py-2 px-6 mt-2 text-xs font-semibold">
              Remove Background
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-card-border text-text-muted font-semibold">
                  <th className="py-3">Image</th>
                  <th className="py-3">Filename</th>
                  <th className="py-3">Size</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload) => (
                  <tr key={upload.id} className="table-row">
                    <td className="py-3">
                      {upload.status === 'completed' ? (
                        <Link 
                          to={`/preview/${upload.id}`}
                          className="relative h-12 w-12 rounded-lg overflow-hidden border border-card-border flex items-center justify-center group cursor-pointer block"
                          style={{ backgroundImage: "radial-gradient(circle, #222222 10%, transparent 11%)", backgroundSize: "6px 6px", backgroundColor: "#0A0A0A" }}
                          title="View Result"
                        >
                          <img src={upload.result_url} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110" alt="cutout" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <Eye className="h-4.5 w-4.5 text-white" />
                          </div>
                        </Link>
                      ) : (
                        <div className="h-12 w-12 rounded-lg overflow-hidden border border-card-border bg-background-secondary flex items-center justify-center relative">
                          <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">
                            {upload.status === 'failed' ? 'Failed' : 'Processing'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 font-semibold text-white max-w-[200px] truncate">{upload.original_filename}</td>
                    <td className="py-3 text-text-muted">{formatBytes(upload.file_size)}</td>
                    <td className="py-3 text-text-muted">{formatDate(upload.created_at)}</td>
                    <td className="py-3">
                      <span className={`badge uppercase text-[9px] font-bold ${
                        upload.status === 'completed' ? 'badge-success' : 'badge-error'
                      }`}>
                        {upload.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {upload.status === 'completed' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/preview/${upload.id}`} className="btn-secondary py-1 px-3 text-xs font-semibold">
                            Open
                          </Link>
                          <button
                            onClick={() => handleDownload(upload)}
                            className="btn-primary py-1 px-3 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all duration-200"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted">Unavailable</span>
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
