import React from 'react'
import { useAuthStore } from '../../stores/authStore'
import { supabase } from '../../lib/supabase'
import { updateProfile } from '../../services/supabase.service'
import { toast } from 'react-hot-toast'
import { User, Lock, Mail, ShieldAlert } from 'lucide-react'

export default function SettingsPage() {
  const { user, profile, fetchProfile } = useAuthStore()
  const [fullName, setFullName] = React.useState(profile?.full_name || '')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile(user.id, { full_name: fullName })
      await fetchProfile(user.id)
      toast.success('Profile details updated!')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile details.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.message || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Account Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage profile credentials, adjust security parameters, and reset passwords.</p>
      </div>

      {/* Profile Info Form */}
      <div className="card p-6 bg-card border-card-border">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-primary" /> Profile Credentials
        </h2>

        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Email (Primary)</label>
            <input type="email" disabled className="input-field opacity-60 cursor-not-allowed" value={user?.email || ''} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Full Name</label>
            <input 
              type="text" 
              required 
              className="input-field" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-fit px-6 py-2.5 text-xs font-semibold mt-2 cursor-pointer">
            Save Details
          </button>
        </form>
      </div>

      {/* Reset Security Password Form */}
      <div className="card p-6 bg-card border-card-border">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Lock className="h-4.5 w-4.5 text-primary" /> Security & Passwords
        </h2>

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">New Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              className="input-field" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Confirm New Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              className="input-field" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-secondary w-fit px-6 py-2.5 text-xs font-semibold mt-2">
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}
