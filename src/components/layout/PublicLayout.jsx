import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { LogIn, Menu, X, Scissors, ArrowRight } from 'lucide-react'

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b shadow-lg shadow-black/10' : 'bg-transparent'}`} style={{ borderColor: scrolled ? 'var(--card-border)' : 'transparent' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white group">
            <span className="p-2 rounded-xl bg-gradient-primary group-hover:scale-105 transition-transform duration-300 shadow-glow-sm">
              <Scissors className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading">SnapCut <span className="gradient-text">AI</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/features" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Features</NavLink>
            <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Pricing</NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-secondary py-2 px-5 text-xs font-semibold">
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
                <Link to="/register" className="btn-primary py-2.5 px-5 text-xs font-semibold">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-text-muted hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl border-t p-6 flex flex-col gap-6" style={{ borderColor: 'var(--card-border)' }}>
          <nav className="flex flex-col gap-4">
            <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-white transition-colors py-1">Features</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-white transition-colors py-1">Pricing</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-white transition-colors py-1">About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-secondary hover:text-white transition-colors py-1">Contact</Link>
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
      <footer className="border-t bg-background-secondary/50 relative overflow-hidden" style={{ borderColor: 'var(--divider)' }}>
        {/* Subtle background */}
        <div className="absolute inset-0 grid-bg opacity-50" />
        
        <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 flex flex-col gap-5">
              <div className="flex items-center gap-2.5 font-bold text-lg text-white">
                <span className="p-2 rounded-xl bg-gradient-primary shadow-glow-sm">
                  <Scissors className="h-4 w-4 text-white" />
                </span>
                <span className="font-heading">SnapCut <span className="gradient-text">AI</span></span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                Professional, automated background removal powered by modern AI. Instant, high-resolution results for eCommerce, marketing, and design.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3 mt-2">
                <a href="#" className="p-2 rounded-lg border transition-all hover:border-primary/30 hover:bg-primary/5 text-text-muted hover:text-primary" style={{ borderColor: 'var(--card-border)' }} aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="p-2 rounded-lg border transition-all hover:border-primary/30 hover:bg-primary/5 text-text-muted hover:text-primary" style={{ borderColor: 'var(--card-border)' }} aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
                <a href="#" className="p-2 rounded-lg border transition-all hover:border-primary/30 hover:bg-primary/5 text-text-muted hover:text-primary" style={{ borderColor: 'var(--card-border)' }} aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="md:col-span-2 md:col-start-6">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-5">Product</h4>
              <ul className="flex flex-col gap-3 text-sm text-text-muted">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-5">Company</h4>
              <ul className="flex flex-col gap-3 text-sm text-text-muted">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-5">Legal</h4>
              <ul className="flex flex-col gap-3 text-sm text-text-muted">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted" style={{ borderTop: '1px solid var(--divider)' }}>
            <span>&copy; {new Date().getFullYear()} SnapCut AI. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              Made with <span className="text-error">&hearts;</span> in India
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
