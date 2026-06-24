import React from 'react'
import { Shield, Palette, Server, Sparkles, Users, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-primary w-[400px] h-[400px] -top-20 -left-20" />
      <div className="orb orb-accent w-[300px] h-[300px] bottom-20 -right-20" />

      <div className="relative z-10 py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary-hover mb-6 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-6 leading-tight">
            About <span className="gradient-text">SnapCut AI</span>
          </h1>
        </div>

        {/* About content */}
        <div className="card p-8 sm:p-10 mb-8">
          <p className="text-text-secondary leading-relaxed text-base mb-6">
            SnapCut AI was founded in 2026 with a single goal: to simplify image processing workflows for creators, designers, and eCommerce merchants worldwide.
          </p>
          <p className="text-text-secondary leading-relaxed text-base">
            Traditional tools require manual tracing, color keying, and expensive licensing fees. Our platform leverages advanced computer vision and neural networks to do the same task in less than 5 seconds with pixel-level precision.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Users, stat: '50K+', label: 'Active Users', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Globe, stat: '120+', label: 'Countries', color: 'text-sky-400', bg: 'bg-sky-500/10' },
            { icon: Server, stat: '99.9%', label: 'Uptime SLA', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="card p-6 text-center hover:scale-[1.03] hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 cursor-default">
                <div className={`p-3 rounded-xl ${item.bg} w-fit mx-auto mb-3`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="stat-number text-3xl mb-1">{item.stat}</div>
                <p className="text-xs text-text-muted uppercase tracking-wider">{item.label}</p>
              </div>
            )
          })}
        </div>

        {/* Values */}
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-white mb-8 font-heading text-center">Our <span className="gradient-text">Values</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Privacy First', desc: 'We never sell your photos. Everything uploaded is deleted automatically within 24 hours.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
              { icon: Palette, title: 'Design Excellence', desc: 'We believe in simple, clean, dark-mode design systems that place user images front-and-center.', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/15' },
              { icon: Server, title: 'Scalable Infra', desc: 'Our workflow is hosted on high-performance serverless runners to ensure maximum uptime.', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/15' },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="card p-6 flex flex-col gap-3 hover:shadow-card-hover hover:scale-[1.03] hover:border-primary/20 transition-all duration-300 group cursor-default">
                  <div className={`p-3 rounded-xl ${item.bg} ${item.border} border w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
