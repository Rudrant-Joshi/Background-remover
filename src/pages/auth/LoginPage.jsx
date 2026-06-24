import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/dashboard'

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw error
      toast.success('Successfully logged in!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="text-2xl font-extrabold text-white text-center font-heading">Welcome Back</h2>
        <p className="text-sm text-text-muted text-center mt-2">Sign in to start background removals</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5" htmlFor="login-email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="email" 
              required 
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-11" 
              placeholder="john@example.com" 
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider" htmlFor="login-password">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="password" 
              required 
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-11" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full mt-2 cursor-pointer flex items-center justify-center gap-2 group"
          id="login-submit"
        >
          {loading ? 'Logging in...' : (
            <>
              <LogIn className="h-4.5 w-4.5" />
              Login to Account
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>



      <p className="text-sm text-text-muted text-center">
        New to SnapCut?{' '}
        <Link to="/register" className="text-primary hover:text-primary-hover font-semibold transition-colors">
          Create account
        </Link>
      </p>
    </div>
  )
}
