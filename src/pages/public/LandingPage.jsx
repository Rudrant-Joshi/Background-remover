import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background glow assets */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="section max-w-7xl mx-auto flex flex-col items-center text-center pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-gen background removal powered by AI</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading mb-6 max-w-4xl leading-tight">
          Remove Backgrounds <br />
          <span className="gradient-text">Instantly & Automatically</span>
        </h1>
        
        <p className="text-lg text-text-secondary max-w-2xl mb-8 leading-relaxed">
          High precision, studio-quality cutout results in less than 5 seconds. Perfect for eCommerce, product listings, presentations, and marketing material.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
          <Link to="/upload" className="btn-primary flex items-center gap-2 group">
            Upload Image Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/pricing" className="btn-secondary">
            View Pricing
          </Link>
        </div>

        {/* Hero Product Demo Showcase */}
        <div className="mt-16 w-full max-w-4xl card bg-card border-card-border p-2 rounded-2xl shadow-glow relative">
          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-background-secondary relative flex items-center justify-center">
            {/* Split screen preview of background removal */}
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800')" }} />
              <div className="w-1/2 h-full bg-slate-900 flex items-center justify-center relative overflow-hidden" style={{ backgroundImage: "radial-gradient(circle, #222222 10%, transparent 11%)", backgroundSize: "16px 16px" }}>
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800" className="absolute h-full w-[200%] max-w-none left-[-100%] object-contain mix-blend-normal [mask-image:linear-gradient(to_right,transparent_50%,black_50%)]" alt="AI cutout demo" />
              </div>
            </div>
            {/* Center Slider Line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary/80 z-10 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-primary text-black flex items-center justify-center shadow-lg font-bold text-xs">
                AI
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section bg-background-secondary border-t border-card-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4 text-white">Why Choose SnapCut AI?</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Built from the ground up to support modern businesses, designers, and scaling SaaS platforms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 flex flex-col gap-4">
              <div className="p-3 rounded-lg bg-primary/10 w-fit text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Sub-5s Processing</h3>
              <p className="text-sm text-text-muted leading-relaxed">Our advanced neural networks identify edge pixels, fine hair strands, and color gradients to return cutouts in under 5 seconds.</p>
            </div>

            <div className="card p-6 flex flex-col gap-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 w-fit text-indigo-400">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Hair & Edge Refinement</h3>
              <p className="text-sm text-text-muted leading-relaxed">Unlike basic color keying, SnapCut handles intricate details like flyaway hair, clothing threads, and transparent glass borders.</p>
            </div>

            <div className="card p-6 flex flex-col gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 w-fit text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Enterprise Privacy</h3>
              <p className="text-sm text-text-muted leading-relaxed">All uploaded assets are stored in encrypted temporary buckets and automatically scrubbed after 24 hours. Your content remains yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading mb-4 text-white">Simple 3-Step Workflow</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Get transparent backgrounds in just a few clicks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-12 w-12 rounded-full bg-card border-2 border-primary flex items-center justify-center font-bold text-lg text-primary">1</div>
            <h3 className="text-lg font-bold text-white">Upload</h3>
            <p className="text-sm text-text-muted">Drag & drop your JPG, PNG, or WEBP image up to 10MB in size.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-12 w-12 rounded-full bg-card border-2 border-primary flex items-center justify-center font-bold text-lg text-primary">2</div>
            <h3 className="text-lg font-bold text-white">AI Processing</h3>
            <p className="text-sm text-text-muted">Our AI detects the subject and cuts out the background cleanly.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-12 w-12 rounded-full bg-card border-2 border-primary flex items-center justify-center font-bold text-lg text-primary">3</div>
            <h3 className="text-lg font-bold text-white">Download</h3>
            <p className="text-sm text-text-muted">Preview the result side-by-side and download your high-res PNG.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
