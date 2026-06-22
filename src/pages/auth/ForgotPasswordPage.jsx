import React from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/settings',
      })
      if (error) throw error
      toast.success('Password reset email sent! Please check your inbox.')
    } catch (err) {
      toast.error(err.message || 'Password reset failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white text-center">Reset Password</h2>
        <p className="text-xs text-text-muted text-center mt-1">Enter email to receive reset link</p>
      </div>

      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10" 
              placeholder="john@example.com" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full mt-2 cursor-pointer"
        >
          {loading ? 'Sending link...' : 'Send Reset Link'}
        </button>
      </form>

      <Link to="/login" className="text-xs text-text-muted hover:text-white flex items-center justify-center gap-2 font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to Login
      </Link>
    </div>
  )
}
