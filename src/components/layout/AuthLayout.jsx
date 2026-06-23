import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Scissors } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-primary w-[500px] h-[500px] -top-40 left-1/4" />
      <div className="orb orb-accent w-[350px] h-[350px] bottom-20 right-1/4" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="flex justify-center items-center gap-2.5 font-bold text-2xl text-white group">
          <span className="p-2.5 rounded-xl bg-gradient-primary shadow-glow-sm group-hover:scale-105 transition-transform duration-300">
            <Scissors className="h-6 w-6 text-white" />
          </span>
          <span className="font-heading">SnapCut <span className="gradient-text">AI</span></span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="card p-8 sm:p-10 shadow-glow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
