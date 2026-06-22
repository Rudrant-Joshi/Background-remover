import React from 'react'

export default function AboutPage() {
  return (
    <div className="py-20 px-4 max-w-3xl mx-auto flex flex-col gap-8">
      <h1 className="text-4xl font-extrabold font-heading text-white">About SnapCut AI</h1>
      <p className="text-text-secondary leading-relaxed text-base">
        SnapCut AI was founded in 2026 with a single goal: to simplify image processing workflows for creators, designers, and eCommerce merchants worldwide.
      </p>
      
      <p className="text-text-secondary leading-relaxed text-base">
        Traditional tools require manual tracing, color keying, and expensive licensing fees. Our platform leverages advanced computer vision and neural networks to do the same task in less than 5 seconds with pixel-level precision.
      </p>

      <div className="divider my-4" />

      <h2 className="text-2xl font-bold text-white">Our Values</h2>
      <ul className="flex flex-col gap-4 text-sm text-text-secondary list-disc pl-5">
        <li><strong>Privacy First:</strong> We never sell your photos. Everything uploaded is deleted automatically within 24 hours.</li>
        <li><strong>Design Consistency:</strong> We believe in simple, clean, dark-mode design systems that place user images front-and-center.</li>
        <li><strong>Scalable Infrastructure:</strong> Our workflow is hosted on high-performance serverless n8n runners to ensure maximum uptime.</li>
      </ul>
    </div>
  )
}
