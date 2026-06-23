import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { Lock, ArrowLeft, ArrowRight } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const handleReset = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password reset successful! You can now log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white text-center font-heading">Choose New Password</h2>
        <p className="text-xs text-text-muted text-center mt-1">Set a new secure password for your account</p>
      </div>

      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2" htmlFor="reset-password">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="password" 
              required 
              id="reset-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2" htmlFor="reset-confirm-password">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="password" 
              required 
              id="reset-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field pl-10" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full mt-2 cursor-pointer flex items-center justify-center gap-2 group"
        >
          {loading ? 'Resetting password...' : (
            <>
              Reset Password
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <Link to="/login" className="text-xs text-text-muted hover:text-white flex items-center justify-center gap-2 font-medium transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Login
      </Link>
    </div>
  )
}
