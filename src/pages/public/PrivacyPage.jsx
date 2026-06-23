import React from 'react'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-primary w-[300px] h-[300px] -top-20 right-0" />

      <div className="relative z-10 py-24 px-4 sm:px-6 max-w-3xl mx-auto flex flex-col gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary-hover mb-6 font-medium">
            <Shield className="h-3.5 w-3.5" />
            <span>Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-white mb-3 leading-tight">Privacy Policy</h1>
          <p className="text-xs text-text-muted">Last Updated: June 16, 2026</p>
        </div>
        
        <div className="card p-8 flex flex-col gap-8">
          <p className="text-text-secondary leading-relaxed text-sm">
            At SnapCut AI, accessible from snapcut.ai, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SnapCut AI and how we use it.
          </p>

          <div>
            <h2 className="text-lg font-bold text-white mb-3">1. Temporary File Storage</h2>
            <p className="text-text-muted leading-relaxed text-sm">
              We do not store your uploaded or processed images permanently on our servers. All original files and final transparent cutouts are uploaded to temporary secure Cloudinary instances and programmatically deleted after 24 hours.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-3">2. Database Storage</h2>
            <p className="text-text-muted leading-relaxed text-sm">
              We store meta details in our secure Supabase PostgreSQL database. This includes: User email, file names, file sizes, processing logs, payments metadata, and API key hashes. This data is kept strictly confidential and never sold to advertisers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-3">3. Security Practices</h2>
            <p className="text-text-muted leading-relaxed text-sm">
              We implement industry-standard encryption, strict JWT session validations, SSL certificates for all API endpoints, and audit logging to protect against data leakage or breaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
