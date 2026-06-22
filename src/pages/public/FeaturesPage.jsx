import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Zap, Layers, RefreshCw, Code, Shield } from 'lucide-react'

export default function FeaturesPage() {
  const featuresList = [
    { title: 'Sub-second Edge Detection', desc: 'State-of-the-art computer vision algorithms outline human subjects, pets, vehicles, and products with absolute precision.', icon: Zap },
    { title: 'Complex Detail Isolation', desc: 'Handles curly hair, clothing fabric, leaves, and semi-transparent objects seamlessly.', icon: Layers },
    { title: 'Batch Processing B2B API', desc: 'Integrate directly into your eCommerce flow or custom CMS with our developer-friendly B2B API endpoints.', icon: Code },
    { title: 'Auto-Delete Security policy', desc: 'We never store files permanently. All input and output assets are auto-deleted within 24 hours.', icon: Shield },
    { title: 'Full Resolution Export', desc: 'No pixel degradation or downsizing. Download assets up to 5000x5000px resolution in pristine quality.', icon: Check },
  ]

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-4 gradient-text">
          Features Built For Professionals
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto text-base">
          From independent creators to high-volume eCommerce platforms, SnapCut AI scales to your visual workflow requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuresList.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="card p-6 hover:border-primary/30 transition-colors flex flex-col gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          )
        })}
      </div>

      {/* CTA Box */}
      <div className="mt-20 card p-8 md:p-12 bg-gradient-dark border-card-border text-center flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-50 pointer-events-none" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Remove Backgrounds in 5 Seconds?</h2>
        <p className="text-text-secondary max-w-md">Get 5 free credits every single day. No credit card required.</p>
        <Link to="/register" className="btn-primary">
          Start Processing Free
        </Link>
      </div>
    </div>
  )
}
