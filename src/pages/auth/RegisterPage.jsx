import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { Mail, Lock, UserPlus, User, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
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
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      if (error) throw error

      if (data?.session) {
        toast.success('Registration successful! Welcome to SnapCut.')
        navigate('/dashboard')
      } else {
        toast.success('Registration successful! Please check your inbox for a verification email.')
        navigate('/verify-email')
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="text-2xl font-extrabold text-white text-center font-heading">Get Started Free</h2>
        <p className="text-sm text-text-muted text-center mt-2">Instant high-res background removal</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5" htmlFor="register-name">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="text" 
              required 
              id="register-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field pl-11" 
              placeholder="John Doe" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5" htmlFor="register-email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="email" 
              required 
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-11" 
              placeholder="john@example.com" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5" htmlFor="register-password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="password" 
              required 
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-11" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5" htmlFor="register-confirm-password">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="password" 
              required 
              id="register-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field pl-11" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full mt-2 cursor-pointer flex items-center justify-center gap-2 group"
          id="register-submit"
        >
          {loading ? 'Creating...' : (
            <>
              <UserPlus className="h-4.5 w-4.5" />
              Create Free Account
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="text-sm text-text-muted text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
          Login instead
        </Link>
      </p>
    </div>
  )
}

