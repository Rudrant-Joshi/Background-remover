import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Your message has been sent successfully. We will get back to you shortly!')
    e.target.reset()
  }

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-5 flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold font-heading text-white">Contact Us</h1>
        <p className="text-text-secondary leading-relaxed text-sm">
          Have questions about pricing, bulk API usage, custom plan credits, or enterprise deployments? Get in touch with our team.
        </p>

        <div className="flex flex-col gap-4 text-sm text-text-secondary mt-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <span>support@snapcut.ai</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Bangalore, Karnataka, India</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 card p-8 bg-card border-card-border">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Name</label>
            <input type="text" required className="input-field" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Email Address</label>
            <input type="email" required className="input-field" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">Message</label>
            <textarea required rows={4} className="input-field resize-none" placeholder="Describe your query..." />
          </div>
          <button type="submit" className="btn-primary w-full mt-2 cursor-pointer">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
