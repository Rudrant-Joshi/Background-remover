import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllUsers } from '../../services/supabase.service'
import { formatDate } from '../../lib/utils'
import { RefreshCw, Search } from 'lucide-react'

export default function AdminUsers() {
  const [page, setPage] = React.useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => getAllUsers(page, 20),
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">User Directory</h1>
        <p className="text-sm text-text-secondary mt-1">Search, examine, and modify profiles, roles, and plan credit parameters.</p>
      </div>

      <div className="card p-6 bg-card border-card-border">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-muted">
            No registered users logged in directory.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-card-border text-text-muted font-semibold">
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Display Name</th>
                  <th className="py-2.5">Active Plan</th>
                  <th className="py-2.5">Daily Credits Quota</th>
                  <th className="py-2.5">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((profile) => (
                  <tr key={profile.id} className="table-row">
                    <td className="py-3 font-semibold text-white">{profile.email}</td>
                    <td className="py-3 text-text-secondary">{profile.full_name || 'N/A'}</td>
                    <td className="py-3 capitalize text-primary font-semibold">
                      {profile.credits?.[0]?.plan || 'Free'}
                    </td>
                    <td className="py-3 text-text-secondary">
                      {profile.credits?.[0]?.used_credits || 0} / {profile.credits?.[0]?.total_credits || 5} Used
                    </td>
                    <td className="py-3 text-text-muted">{formatDate(profile.created_at)}</td>
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
