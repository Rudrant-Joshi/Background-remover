import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400">
        <CheckCircle className="h-12 w-12 animate-pulse-slow" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">Check Your Email</h2>
        <p className="text-sm text-text-secondary mt-2">
          We have sent a verification link to your registered email address. Please open it to complete authentication setup.
        </p>
      </div>

      <div className="divider" />

      <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
        Continue to Login
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
