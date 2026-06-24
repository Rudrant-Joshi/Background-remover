import React from 'react'
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Your message has been sent successfully. We will get back to you shortly!')
    e.target.reset()
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-primary w-[400px] h-[400px] -top-20 right-0" />
      <div className="orb orb-accent w-[300px] h-[300px] bottom-20 -left-10" />

      <div className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary-hover mb-6 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Get In Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-4 leading-tight">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-text-muted max-w-lg mx-auto text-sm sm:text-base">
            Have questions about pricing, bulk API usage, or enterprise deployments? Our team is ready to help.
          </p>
          <p className="text-xs text-primary/70 mt-3 font-medium tracking-wide">
            This website is made by Rudrant Joshi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {[
              { icon: Mail, label: 'Email Us', value: 'rudrant.joshi@gmail.com', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
              { icon: Phone, label: 'Call Us', value: '+91 70410 24680', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/15' },
              { icon: MapPin, label: 'Visit Us', value: 'Ahmedabad, Gujarat, India', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="card p-5 flex items-center gap-4 hover:shadow-card-hover hover:scale-[1.03] hover:border-primary/20 transition-all duration-300 group cursor-default">
                  <div className={`p-3 rounded-xl ${item.bg} ${item.border} border group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-0.5">{item.label}</p>
                    <p className="text-sm text-white font-medium">{item.value}</p>
                  </div>
                </div>
              )
            })}

            {/* Response time */}
            <div className="card-glass p-5 mt-2 hover:scale-[1.03] hover:shadow-card-hover transition-all duration-300 cursor-default">
              <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-semibold">Average Response Time</p>
              <p className="text-2xl font-extrabold text-white">~2 <span className="text-sm text-text-muted font-normal">hours</span></p>
              <p className="text-xs text-text-muted mt-1">During business hours (IST 9AM - 6PM)</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7">
            <div className="card p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Name</label>
                    <input type="text" required className="input-field" placeholder="John Doe" id="contact-name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Email</label>
                    <input type="email" required className="input-field" placeholder="john@example.com" id="contact-email" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Subject</label>
                  <input type="text" required className="input-field" placeholder="How can we help?" id="contact-subject" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Message</label>
                  <textarea required rows={5} className="input-field resize-none" placeholder="Describe your query in detail..." id="contact-message" />
                </div>
                <button type="submit" className="btn-primary w-full mt-2 cursor-pointer flex items-center justify-center gap-2 group" id="contact-submit">
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
