import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUploadById } from '../../services/supabase.service'
import { getLocalUploadById } from '../../services/localDb.service'
import { Download, RefreshCw, LayoutGrid, Split, ArrowLeft, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function PreviewPage() {
  const { id } = useParams()
  const [viewMode, setViewMode] = React.useState('split') // 'split' | 'result' | 'original'

  const { data: upload, isLoading, error } = useQuery({
    queryKey: ['upload', id],
    queryFn: async () => {
      try {
        const localRecord = await getLocalUploadById(id)
        if (localRecord && (localRecord.result_url || localRecord.original_url)) {
          return localRecord
        }
      } catch (err) {
        console.warn('Failed to fetch from local database:', err)
      }
      return await getUploadById(id)
    },
    enabled: !!id,
  })

  const handleDownload = async () => {
    if (!upload?.result_url) return
    try {
      const response = await fetch(upload.result_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `snapcut_${upload.original_filename || 'transparent.png'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Download started!')
    } catch (err) {
      toast.error('Failed to trigger download. Open image in new tab to save.')
      window.open(upload.result_url, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <span className="text-sm text-text-secondary">Loading preview...</span>
      </div>
    )
  }

  if (error || !upload) {
    return (
      <div className="text-center py-20 flex flex-col items-center gap-4">
        <span className="text-sm text-error font-semibold">Asset not found or expired.</span>
        <Link to="/upload" className="btn-primary py-2 px-6">
          Upload New Image
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Top Navbar Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link to="/upload" className="text-xs text-text-secondary hover:text-white flex items-center gap-2 font-medium">
          <ArrowLeft className="h-4 w-4" /> Upload Workspace
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('split')}
            className={`py-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              viewMode === 'split' ? 'bg-primary text-black border-primary' : 'bg-card text-text-secondary border-card-border hover:text-white'
            }`}
          >
            <Split className="h-3.5 w-3.5" /> Side-by-Side
          </button>
          <button 
            onClick={() => setViewMode('result')}
            className={`py-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              viewMode === 'result' ? 'bg-primary text-black border-primary' : 'bg-card text-text-secondary border-card-border hover:text-white'
            }`}
          >
            Transparent Result
          </button>
          <button 
            onClick={() => setViewMode('original')}
            className={`py-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              viewMode === 'original' ? 'bg-primary text-black border-primary' : 'bg-card text-text-secondary border-card-border hover:text-white'
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="card border-card-border bg-card p-4 min-h-[400px] flex items-center justify-center relative overflow-hidden">
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-center">Original Image</span>
              <div className="aspect-[4/3] w-full rounded border border-card-border bg-background-secondary overflow-hidden flex items-center justify-center">
                <img src={upload.original_url} className="h-full w-full object-contain" alt="Original" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-center">Transparent Cutout</span>
              <div 
                className="aspect-[4/3] w-full rounded border border-card-border overflow-hidden flex items-center justify-center"
                style={{ backgroundImage: "radial-gradient(circle, #222222 10%, transparent 11%)", backgroundSize: "12px 12px", backgroundColor: "#0A0A0A" }}
              >
                <img src={upload.result_url} className="h-full w-full object-contain" alt="Result" />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'result' && (
          <div 
            className="w-full max-w-2xl aspect-[4/3] rounded border border-card-border overflow-hidden flex items-center justify-center"
            style={{ backgroundImage: "radial-gradient(circle, #222222 10%, transparent 11%)", backgroundSize: "16px 16px", backgroundColor: "#050505" }}
          >
            <img src={upload.result_url} className="h-full w-full object-contain" alt="Result transparent" />
          </div>
        )}

        {viewMode === 'original' && (
          <div className="w-full max-w-2xl aspect-[4/3] rounded border border-card-border overflow-hidden flex items-center justify-center bg-background-secondary">
            <img src={upload.original_url} className="h-full w-full object-contain" alt="Original image" />
          </div>
        )}
      </div>

      {/* Export Action Card */}
      <div className="card p-6 bg-background-secondary border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white">Prisinquality PNG ready</span>
          <span className="text-xs text-text-muted mt-0.5">Transparent background, export up to 5000x5000px</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleDownload}
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Download className="h-4.5 w-4.5" /> Download Cutout
          </button>
        </div>
      </div>
    </div>
  )
}
