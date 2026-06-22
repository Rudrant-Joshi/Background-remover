import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Scissors } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="flex justify-center items-center gap-2 font-bold text-2xl text-white">
          <span className="p-2.5 rounded-lg bg-gradient-primary">
            <Scissors className="h-6 w-6 text-white" />
          </span>
          <span className="font-heading">SnapCut <span className="text-primary">AI</span></span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="card bg-card border-card-border py-8 px-4 sm:px-10 shadow-glow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
