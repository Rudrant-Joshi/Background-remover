import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { LogIn, Menu, X, Scissors } from 'lucide-react'

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-card-border bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
            <span className="p-2 rounded-lg bg-gradient-primary group-hover:scale-105 transition-transform duration-200">
              <Scissors className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading">SnapCut <span className="text-primary">AI</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/features" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Features</NavLink>
            <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Pricing</NavLink>
            <NavLink to="/api-docs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>API Docs</NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-secondary py-2 px-4 text-xs font-semibold">
                  Dashboard
                </Link>
                <button onClick={() => { signOut(); navigate('/'); }} className="btn-ghost py-2 px-4 text-xs font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost py-2 px-4 text-xs font-semibold flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-xs font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-text-secondary hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-lg border-t border-card-border p-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-white">Features</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-white">Pricing</Link>
            <Link to="/api-docs" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-white">API Docs</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-white">About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-white">Contact</Link>
          </nav>
          <div className="divider" />
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full text-center">
                  Dashboard
                </Link>
                <button onClick={() => { signOut(); navigate('/'); setMobileMenuOpen(false); }} className="btn-secondary w-full">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-full text-center">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full text-center">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border bg-background-secondary py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <span className="p-1.5 rounded bg-gradient-primary">
                <Scissors className="h-4 w-4 text-white" />
              </span>
              <span>SnapCut AI</span>
            </div>
            <p className="text-sm text-text-muted">
              Professional, automated background removal powered by modern AI. Instant, high-resolution results for eCommerce, marketing, and design.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li><Link to="/features" className="hover:text-white">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/api-docs" className="hover:text-white">B2B API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <span>&copy; {new Date().getFullYear()} SnapCut AI. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">GitHub</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
