import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Upload, Download, Star, ChevronRight, Play } from 'lucide-react'
import heroWithBg from '../../assets/hero_with_bg.png'
import heroNoBg from '../../assets/hero_no_bg.png'
import demoProduct from '../../assets/demo_product.png'

export default function LandingPage() {
  const [sliderPos, setSliderPos] = React.useState(50)
  const sliderRef = React.useRef(null)
  const isDragging = React.useRef(false)

  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }

  const handleMouseDown = () => { isDragging.current = true }
  const handleMouseUp = () => { isDragging.current = false }
  const handleMouseMove = (e) => { if (isDragging.current) handleSliderMove(e.clientX) }
  const handleTouchMove = (e) => { handleSliderMove(e.touches[0].clientX) }
  const handleContainerMouseMove = (e) => { handleSliderMove(e.clientX) }

  React.useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-primary w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2" />
      <div className="orb orb-accent w-[400px] h-[400px] top-1/3 -right-20" />
      <div className="orb orb-warm w-[300px] h-[300px] bottom-20 -left-20" />

      {/* ===== HERO SECTION ===== */}
      <section className="section max-w-7xl mx-auto pt-20 sm:pt-28 pb-8 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary-hover backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-gen AI background removal</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight font-heading mb-6 max-w-5xl mx-auto leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          Remove Backgrounds{' '}
          <span className="gradient-text">Instantly</span>
          <br />
          <span className="text-text-secondary font-bold text-3xl sm:text-4xl md:text-5xl">with Studio-Quality Precision</span>
        </h1>

        {/* Subtitle */}
        <p className="text-center text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}>
          High precision cutouts in under 5 seconds. Perfect for eCommerce product photos, marketing campaigns, and professional presentations.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 z-10 animate-fade-in-up" style={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards' }}>
          <Link to="/upload" className="btn-primary flex items-center gap-2 group text-base">
            <Upload className="h-4.5 w-4.5" />
            Upload Image Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/features" className="btn-secondary flex items-center gap-2">
            <Play className="h-4 w-4" />
            See How It Works
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 mt-12 mb-4 animate-fade-in-up" style={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="text-center">
            <div className="stat-number">2M+</div>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Images Processed</p>
          </div>
          <div className="h-8 w-px bg-divider hidden sm:block" />
          <div className="text-center">
            <div className="stat-number">&lt;5s</div>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Avg. Processing</p>
          </div>
          <div className="h-8 w-px bg-divider hidden sm:block" />
          <div className="text-center">
            <div className="stat-number">99%</div>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Edge Accuracy</p>
          </div>
        </div>

        {/* ===== HERO BEFORE/AFTER SHOWCASE ===== */}
        <div className="mt-12 w-full max-w-5xl mx-auto animate-fade-in-up transition-all duration-500 hover:scale-[1.02]" style={{ animationDelay: '0.55s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="card-highlight p-1.5 sm:p-2 shadow-glow-lg hover:shadow-glow-accent transition-all duration-500">
            <div
              ref={sliderRef}
              className="aspect-[16/9] sm:aspect-[2/1] w-full rounded-xl overflow-hidden relative cursor-col-resize select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleContainerMouseMove}
              onTouchStart={handleMouseDown}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Right side: transparent/removed background */}
              <div className="absolute inset-0 checkerboard">
                <img
                  src={heroNoBg}
                  alt="AI background removal result"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Left side: original with background (clipped using clip-path) */}
              <img
                src={heroWithBg}
                alt="Original image with background"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
              />

              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 z-20 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="h-full w-[2px] bg-white/80 shadow-lg" />
                <div className="absolute h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center">
                  <div className="flex items-center gap-0.5">
                    <ChevronRight className="h-3.5 w-3.5 text-gray-700 rotate-180" />
                    <ChevronRight className="h-3.5 w-3.5 text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 z-10 badge badge-info text-[10px] uppercase tracking-widest font-bold">Original</div>
              <div className="absolute top-4 right-4 z-10 badge badge-success text-[10px] uppercase tracking-widest font-bold">Processed</div>
            </div>
          </div>
          <p className="text-center text-xs text-text-muted mt-3">← Move your mouse or drag the slider to compare before & after →</p>
        </div>
      </section>

      {/* ===== TRUSTED BY / SOCIAL PROOF ===== */}
      <section className="py-16 px-4 border-t border-b border-divider relative z-10 bg-background-secondary/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-text-muted mb-8 font-semibold">Trusted by professionals worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-40">
            {['Shopify', 'Amazon', 'Canva', 'Figma', 'Adobe', 'Etsy'].map((brand) => (
              <span key={brand} className="text-lg sm:text-xl font-bold text-text-secondary tracking-wide font-heading">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="section relative z-10" id="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary-hover mb-4 font-medium">
              <Zap className="h-3.5 w-3.5" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-4 text-white">
              Enterprise-Grade <span className="gradient-text">AI Processing</span>
            </h2>
            <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base">Built from the ground up for modern businesses, designers, and scaling SaaS platforms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/10', title: 'Sub-5s Processing', desc: 'Our advanced neural networks identify edge pixels, fine hair strands, and color gradients to return cutouts in under 5 seconds.' },
              { icon: Layers, color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/10', title: 'Hair & Edge Refinement', desc: 'Unlike basic color keying, SnapCut handles intricate details like flyaway hair, clothing threads, and transparent glass borders.' },
              { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/10', title: 'Enterprise Privacy', desc: 'All uploaded assets are stored in encrypted temporary buckets and automatically scrubbed after 24 hours. Your content remains yours.' },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className={`card p-7 flex flex-col gap-4 hover:shadow-card-hover hover:scale-[1.03] hover:-translate-y-1.5 hover:border-primary/25 transition-all duration-300 group`}>
                  <div className={`p-3 rounded-xl ${feature.bg} ${feature.border} border w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/15 bg-accent/5 text-xs text-accent-hover mb-4 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-4 text-white">
            Three Steps to <span className="gradient-text">Perfect Cutouts</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base">Get transparent backgrounds in just a few clicks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line between steps (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 z-0" />

          {[
            { step: '01', icon: Upload, title: 'Upload', desc: 'Drag & drop your JPG, PNG, or WEBP image up to 10MB in size.', color: 'border-amber-500/30 text-amber-400' },
            { step: '02', icon: Sparkles, title: 'AI Processing', desc: 'Our AI detects the subject and cuts out the background cleanly.', color: 'border-amber-500/30 text-amber-300' },
            { step: '03', icon: Download, title: 'Download', desc: 'Preview the result side-by-side and download your high-res PNG.', color: 'border-emerald-500/30 text-emerald-400' },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex flex-col items-center text-center gap-5 relative z-10">
                <div className={`h-16 w-16 rounded-2xl bg-card-solid border-2 ${item.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold block mb-1">Step {item.step}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-text-muted max-w-xs mx-auto">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== PRODUCT SHOWCASE ===== */}
      <section className="section relative z-10 bg-background-secondary/30 border-t border-divider">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary-hover mb-6 font-medium">
                <Star className="h-3.5 w-3.5" />
                <span>Product Photography</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-6 text-white leading-tight">
                Perfect for <span className="gradient-text">eCommerce</span>
                <br />Product Listings
              </h2>
              <p className="text-text-muted mb-8 leading-relaxed">
                Remove cluttered backgrounds from product photos in seconds. Get clean, professional-looking images that increase conversion rates and meet marketplace requirements.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {['Amazon & Shopify ready white backgrounds', 'Batch process hundreds of SKUs', 'Full resolution PNG export', 'API integration for automation'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-text-secondary">
                    <div className="h-5 w-5 rounded-full bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/upload" className="btn-primary inline-flex items-center gap-2 group">
                Try It Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Product demo */}
            <div className="relative">
              <div className="card p-2 shadow-glow">
                <div className="rounded-xl overflow-hidden checkerboard">
                  <img
                    src={demoProduct}
                    alt="Product photo with background removed"
                    className="w-full h-auto"
                  />
                </div>
              </div>
              {/* Floating quality badge */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 card-glass px-4 py-3 rounded-xl shadow-card animate-float">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">HD Quality</p>
                    <p className="text-[10px] text-text-muted">5000×5000px</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="section relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="card-highlight p-10 sm:p-16 text-center relative overflow-hidden">
            {/* Background orbs */}
            <div className="orb orb-primary w-[300px] h-[300px] -top-20 -left-20" />
            <div className="orb orb-accent w-[200px] h-[200px] -bottom-10 -right-10" />

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-4 relative z-10">
              Ready to Remove Backgrounds<br /><span className="gradient-text">in 5 Seconds?</span>
            </h2>
            <p className="text-text-muted max-w-md mx-auto mb-8 relative z-10">Get 5 free credits every single day. No credit card required.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link to="/register" className="btn-primary text-base px-8 py-4 group">
                Start Processing Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/pricing" className="btn-secondary">
                View Pricing Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
