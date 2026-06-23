import React from 'react'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-accent w-[300px] h-[300px] -top-20 left-0" />

      <div className="relative z-10 py-24 px-4 sm:px-6 max-w-3xl mx-auto flex flex-col gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary-hover mb-6 font-medium">
            <FileText className="h-3.5 w-3.5" />
            <span>Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-white mb-3 leading-tight">Terms & Conditions</h1>
          <p className="text-xs text-text-muted">Last Updated: June 16, 2026</p>
        </div>

        <div className="card p-8 flex flex-col gap-8">
          <p className="text-text-secondary leading-relaxed text-sm">
            By accessing or using the services provided by SnapCut AI, you agree to comply with and be bound by the following terms of service.
          </p>

          <div>
            <h2 className="text-lg font-bold text-white mb-3">1. Acceptable Use Policy</h2>
            <p className="text-text-muted leading-relaxed text-sm">
              Users must not upload images containing illegal material, violent images, or copyrighted material without appropriate ownership permissions. Doing so will result in an immediate account ban and revocation of credits without refund.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-3">2. Credit Usage & Renewal</h2>
            <p className="text-text-muted leading-relaxed text-sm">
              Free daily credits reset at 00:00 UTC. Purchased credit packs have no expiration date. Pro subscription credits are unlimited for regular user operations. Automated scraping using browser triggers is forbidden on dashboard components; use the B2B API endpoints instead.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-3">3. Limitation of Liability</h2>
            <p className="text-text-muted leading-relaxed text-sm">
              SnapCut AI will not be held liable for any data loss, service interruptions, or file loss resulting from third-party API outages or internet network failures.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
