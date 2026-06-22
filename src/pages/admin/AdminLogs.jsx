import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLogs } from '../../services/supabase.service'
import { formatDate } from '../../lib/utils'
import { FileTerminal, RefreshCw } from 'lucide-react'

export default function AdminLogs() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: () => getLogs(1, 50),
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">System Error & Workflow Logs</h1>
        <p className="text-sm text-text-secondary mt-1">Telemetry log output of background removal queues, network exceptions, and auth issues.</p>
      </div>

      <div className="card p-6 bg-card border-card-border">
        <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <FileTerminal className="h-4.5 w-4.5 text-warning" /> System Event Streams
        </h2>

        {isLoading ? (
          <div className="skeleton h-24 w-full" />
        ) : !data?.data || data.data.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-muted">
            No system log rows stored in telemetry database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-card-border text-text-muted font-semibold">
                  <th className="py-2.5">Event Type</th>
                  <th className="py-2.5">Log Level</th>
                  <th className="py-2.5">Message Description</th>
                  <th className="py-2.5">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((log) => (
                  <tr key={log.id} className="table-row">
                    <td className="py-3 font-semibold text-white">{log.event_type}</td>
                    <td className="py-3">
                      <span className={`badge uppercase text-[8px] font-bold ${
                        log.status === 'success' ? 'badge-success' : 'badge-error'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-text-secondary max-w-[300px] truncate">{log.message}</td>
                    <td className="py-3 text-text-muted">{formatDate(log.created_at)}</td>
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
