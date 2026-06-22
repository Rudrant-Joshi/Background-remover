import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { Mail, Lock, UserPlus, User } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      if (error) throw error

      // Automatically sign in after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError

      toast.success('Registration successful! Welcome to SnapCut.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white text-center">Get Started Free</h2>
        <p className="text-xs text-text-muted text-center mt-1">Instant high-res background removal</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="text" 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field pl-10" 
              placeholder="John Doe" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Email</label>
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

        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full mt-2 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? 'Creating...' : (
            <>
              <UserPlus className="h-4.5 w-4.5" />
              Create Free Account
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-text-muted text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-hover font-semibold">
          Login instead
        </Link>
      </p>
    </div>
  )
}
