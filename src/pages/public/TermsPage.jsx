import React from 'react'

export default function TermsPage() {
  return (
    <div className="py-20 px-4 max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-4xl font-extrabold font-heading text-white mb-2">Terms & Conditions</h1>
      <p className="text-xs text-text-muted">Last Updated: June 16, 2026</p>

      <p className="text-text-secondary leading-relaxed text-sm">
        By accessing or using the services provided by SnapCut AI, you agree to comply with and be bound by the following terms of service.
      </p>

      <h2 className="text-xl font-bold text-white mt-4">1. Acceptable Use Policy</h2>
      <p className="text-text-secondary leading-relaxed text-sm">
        Users must not upload images containing illegal material, violent images, or copyrighted material without appropriate ownership permissions. Doing so will result in an immediate account ban and revocation of credits without refund.
      </p>

      <h2 className="text-xl font-bold text-white mt-4">2. Credit Usage & Renewal</h2>
      <p className="text-text-secondary leading-relaxed text-sm">
        Free daily credits reset at 00:00 UTC. Purchased credit packs have no expiration date. Pro subscription credits are unlimited for regular user operations. Automated scraping using browser triggers is forbidden on dashboard components; use the B2B API endpoints instead.
      </p>

      <h2 className="text-xl font-bold text-white mt-4">3. Limitation of Liability</h2>
      <p className="text-text-secondary leading-relaxed text-sm">
        SnapCut AI will not be held liable for any data loss, service interruptions, or file loss resulting from third-party API outages or internet network failures.
      </p>
    </div>
  )
}
