import React from 'react'

export default function ApiDocsPage() {
  const codeExampleCurl = `curl -X POST https://api.snapcut.ai/v1/remove-background \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "https://example.com/original.jpg",
    "sync": true
  }'`

  const codeExampleJs = `const response = await fetch('https://api.snapcut.ai/v1/remove-background', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/original.jpg',
    sync: true
  })
});
const result = await response.json();
console.log(result.result_url);`

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Sidebar Documentation List */}
      <div className="lg:col-span-3 flex flex-col gap-6 sticky top-24 h-fit">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">REST API</h4>
        <nav className="flex flex-col gap-2 text-sm">
          <a href="#authentication" className="text-white font-medium">Authentication</a>
          <a href="#endpoints" className="text-text-secondary hover:text-white">Endpoints</a>
          <a href="#rate-limits" className="text-text-secondary hover:text-white">Rate Limits</a>
          <a href="#errors" className="text-text-secondary hover:text-white">Error Codes</a>
        </nav>
      </div>

      {/* Main Documentation Page */}
      <div className="lg:col-span-9 flex flex-col gap-12">
        <div>
          <h1 className="text-4xl font-extrabold font-heading mb-4 text-white">Developer API Reference</h1>
          <p className="text-text-secondary leading-relaxed text-base">
            Integrate SnapCut AI's background removal directly into your application, workflow, or ecommerce platform. Send image URLs, receive cutouts in under 5 seconds.
          </p>
        </div>

        <div id="authentication" className="divider" />

        {/* Auth Documentation */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">Authentication</h2>
          <p className="text-sm text-text-muted">
            Authenticate all requests using your developer API key passed in the <code className="bg-card text-primary px-1.5 py-0.5 rounded font-mono text-xs">Authorization</code> header.
          </p>
          <div className="card p-4 bg-background-secondary border-card-border font-mono text-xs text-text-secondary">
            Authorization: Bearer sk_live_...
          </div>
        </div>

        <div id="endpoints" className="divider" />

        {/* Endpoint Documentation */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="badge badge-primary font-bold text-xs uppercase mr-3">POST</span>
            <span className="font-mono text-sm text-white font-bold">/v1/remove-background</span>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">
            Submit an image URL for background removal. Returns a processing URL that resolves once the background is transparent.
          </p>

          <h3 className="text-md font-bold text-white mt-4">Payload Attributes</h3>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-card-border text-text-muted font-semibold">
                <th className="py-2">Parameter</th>
                <th className="py-2">Type</th>
                <th className="py-2">Required</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-card-border text-text-secondary">
                <td className="py-3 font-mono text-xs text-primary">image_url</td>
                <td className="py-3 text-text-muted">String</td>
                <td className="py-3 font-semibold text-emerald-400">Yes</td>
                <td className="py-3">Public HTTP URL of image to process.</td>
              </tr>
              <tr className="border-b border-card-border text-text-secondary">
                <td className="py-3 font-mono text-xs text-primary">sync</td>
                <td className="py-3 text-text-muted">Boolean</td>
                <td className="py-3 text-text-muted">No</td>
                <td className="py-3">If true, awaits processing and returns result directly (default: true).</td>
              </tr>
            </tbody>
          </table>

          {/* Code Tabs */}
          <div className="card bg-card border-card-border mt-6">
            <div className="border-b border-card-border px-4 py-2 flex items-center justify-between bg-background-secondary rounded-t-xl">
              <span className="text-xs font-semibold text-text-muted">cURL Example Request</span>
            </div>
            <pre className="p-4 overflow-x-auto text-xs text-primary font-mono leading-relaxed bg-black rounded-b-xl">
              <code>{codeExampleCurl}</code>
            </pre>
          </div>

          <div className="card bg-card border-card-border">
            <div className="border-b border-card-border px-4 py-2 flex items-center justify-between bg-background-secondary rounded-t-xl">
              <span className="text-xs font-semibold text-text-muted">JavaScript Example Request</span>
            </div>
            <pre className="p-4 overflow-x-auto text-xs text-primary font-mono leading-relaxed bg-black rounded-b-xl">
              <code>{codeExampleJs}</code>
            </pre>
          </div>
        </div>

        <div id="rate-limits" className="divider" />

        {/* Rate Limiting */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">Rate Limits</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Free accounts are restricted to 10 requests per minute. Pro subscribers enjoy up to 100 requests per minute. Custom enterprise limits can be arranged upon request.
          </p>
        </div>
      </div>
    </div>
  )
}
