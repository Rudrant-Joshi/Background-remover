import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="py-20 px-4 max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-4xl font-extrabold font-heading text-white mb-2">Privacy Policy</h1>
      <p className="text-xs text-text-muted">Last Updated: June 16, 2026</p>
      
      <p className="text-text-secondary leading-relaxed text-sm">
        At SnapCut AI, accessible from snapcut.ai, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SnapCut AI and how we use it.
      </p>

      <h2 className="text-xl font-bold text-white mt-4">1. Temporary File Storage</h2>
      <p className="text-text-secondary leading-relaxed text-sm">
        We do not store your uploaded or processed images permanently on our servers. All original files and final transparent cutouts are uploaded to temporary secure Cloudinary instances and programmatically deleted after 24 hours.
      </p>

      <h2 className="text-xl font-bold text-white mt-4">2. Database Storage</h2>
      <p className="text-text-secondary leading-relaxed text-sm">
        We store meta details in our secure Supabase PostgreSQL database. This includes: User email, file names, file sizes, processing logs, payments metadata, and API key hashes. This data is kept strictly confidential and never sold to advertisers.
      </p>

      <h2 className="text-xl font-bold text-white mt-4">3. Security Practices</h2>
      <p className="text-text-secondary leading-relaxed text-sm">
        We implement industry-standard encryption, strict JWT session validations, SSL certificates for all API endpoints, and audit logging to protect against data leakage or breaches.
      </p>
    </div>
  )
}
