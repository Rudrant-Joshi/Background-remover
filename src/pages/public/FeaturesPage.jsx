import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Zap, Layers, Code, Shield, Image, ArrowRight, Sparkles } from 'lucide-react'

export default function FeaturesPage() {
  const featuresList = [
    { title: 'Sub-second Edge Detection', desc: 'State-of-the-art computer vision algorithms outline human subjects, pets, vehicles, and products with absolute precision.', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
    { title: 'Complex Detail Isolation', desc: 'Handles curly hair, clothing fabric, leaves, and semi-transparent objects seamlessly.', icon: Layers, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/15' },
    { title: 'Batch Processing B2B API', desc: 'Integrate directly into your eCommerce flow or custom CMS with our developer-friendly B2B API endpoints.', icon: Code, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
    { title: 'Auto-Delete Security', desc: 'We never store files permanently. All input and output assets are auto-deleted within 24 hours.', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
    { title: 'Full Resolution Export', desc: 'No pixel degradation or downsizing. Download assets up to 5000x5000px resolution in pristine quality.', icon: Image, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/15' },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-primary w-[500px] h-[500px] -top-40 right-0" />
      <div className="orb orb-accent w-[300px] h-[300px] bottom-40 -left-20" />

      <div className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary-hover mb-6 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading mb-6 leading-tight">
            Features Built For<br />
            <span className="gradient-text">Professionals</span>
          </h1>
          <p className="text-text-muted max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            From independent creators to high-volume eCommerce platforms, SnapCut AI scales to your visual workflow requirements.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((item, idx) => {
            const Icon = item.icon
            return (
              <div 
                key={idx} 
                className="card p-7 hover:shadow-card-hover hover:scale-[1.03] hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 flex flex-col gap-4 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className={`p-3 rounded-xl ${item.bg} ${item.border} border w-fit group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>

        {/* CTA Box */}
        <div className="mt-24">
          <div className="card-highlight p-10 sm:p-14 text-center flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="orb orb-primary w-[250px] h-[250px] -top-20 -right-20" />
            <div className="orb orb-accent w-[150px] h-[150px] -bottom-10 -left-10" />
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white relative z-10">
              Ready to Remove Backgrounds <span className="gradient-text">in 5 Seconds?</span>
            </h2>
            <p className="text-text-muted max-w-md relative z-10">Get 5 free credits every single day. No credit card required.</p>
            <Link to="/register" className="btn-primary relative z-10 group">
              Start Processing Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
