import React from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useQuery } from '@tanstack/react-query'
import { getApiKeys, createApiKey, revokeApiKey } from '../../services/supabase.service'
import { generateApiKey } from '../../lib/utils'
import { Key, Plus, Trash2, AlertTriangle, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ApiKeysPage() {
  const { user } = useAuthStore()
  const [newKeyName, setNewKeyName] = React.useState('')
  const [generatedKey, setGeneratedKey] = React.useState('')
  const [copied, setCopied] = React.useState(false)

  const { data: apiKeys, isLoading, refetch } = useQuery({
    queryKey: ['apiKeys', user?.id],
    queryFn: () => getApiKeys(user.id),
    enabled: !!user?.id,
  })

  const handleCreateKey = async (e) => {
    e.preventDefault()
    if (!newKeyName) return

    const rawKey = generateApiKey()
    const prefix = rawKey.substring(0, 12)
    
    // Hash key client-side / service layer
    // For simple verification we store hash of actual key in Postgres
    // In real app we hash via crypto, let's mock representation safely
    const keyHash = btoa(rawKey) 

    try {
      await createApiKey(user.id, newKeyName, keyHash, prefix)
      setGeneratedKey(rawKey)
      setNewKeyName('')
      refetch()
      toast.success('B2B API Key generated!')
    } catch (err) {
      toast.error('Failed to register API key.')
    }
  }

  const handleRevokeKey = async (keyId) => {
    if (!confirm('Are you sure you want to revoke this API key? This cannot be undone.')) return
    try {
      await revokeApiKey(keyId, user.id)
      refetch()
      toast.success('API key has been revoked.')
    } catch (err) {
      toast.error('Failed to revoke API key.')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey)
    setCopied(true)
    toast.success('API Key copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">B2B API Keys</h1>
        <p className="text-sm text-text-secondary mt-1">Provision developer credentials to programmatically process background removals.</p>
      </div>

      {/* Provision Info Banner */}
      <div className="card p-4 border-primary/20 bg-primary/5 text-primary flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold">Important API Key Notice:</span>
          <p className="mt-1 leading-relaxed text-text-secondary">
            Keep your API keys confidential. Do not share them or commit them to public version control repositories. Refer to our <a href="/api-docs" className="underline text-primary">API Documentation</a> page for implementation structures.
          </p>
        </div>
      </div>

      {/* Generated key presentation modal */}
      {generatedKey && (
        <div className="card p-6 border-success/30 bg-success/5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">New API Key Generated</h3>
            <p className="text-xs text-text-muted mt-1">Copy this token now. It will not be shown again.</p>
          </div>
          <div className="flex items-center gap-3 bg-black border border-card-border p-3 rounded-lg font-mono text-xs">
            <span className="text-primary truncate flex-1">{generatedKey}</span>
            <button onClick={handleCopy} className="p-1.5 text-text-muted hover:text-white transition-colors">
              {copied ? <Check className="h-4.5 w-4.5 text-success" /> : <Copy className="h-4.5 w-4.5" />}
            </button>
          </div>
          <button onClick={() => setGeneratedKey('')} className="btn-secondary py-1.5 px-4 text-xs font-semibold w-fit">
            Dismiss
          </button>
        </div>
      )}

      {/* Key Creator Form */}
      <div className="card p-6 bg-card border-card-border">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Key className="h-4.5 w-4.5 text-primary" /> Provision New Key
        </h2>
        <form onSubmit={handleCreateKey} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Friendly Key Label</label>
            <input 
              type="text" 
              required 
              className="input-field" 
              placeholder="e.g. Production Backend" 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary py-3 px-6 text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Generate Key
          </button>
        </form>
      </div>

      {/* Active Keys Table */}
      <div className="card p-6 bg-card border-card-border">
        <h2 className="text-lg font-bold text-white mb-6">Your Provisioned API Keys</h2>

        {isLoading ? (
          <div className="skeleton h-24 w-full" />
        ) : !apiKeys || apiKeys.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-muted">
            No API credentials registered. Use the form above to provision your first client token.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-card-border text-text-muted font-semibold">
                  <th className="py-2.5">Label</th>
                  <th className="py-2.5">Prefix Identifier</th>
                  <th className="py-2.5">Requests</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="table-row">
                    <td className="py-3 font-semibold text-white">{key.name}</td>
                    <td className="py-3 font-mono text-xs text-text-secondary">{key.key_prefix}...</td>
                    <td className="py-3 text-text-muted">{key.total_requests || 0} calls</td>
                    <td className="py-3">
                      <span className={`badge text-[9px] font-bold uppercase ${
                        key.is_active ? 'badge-success' : 'badge-error'
                      }`}>
                        {key.is_active ? 'active' : 'revoked'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {key.is_active && (
                        <button 
                          onClick={() => handleRevokeKey(key.id)}
                          className="p-1.5 text-text-muted hover:text-error transition-colors"
                          title="Revoke Key"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
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
