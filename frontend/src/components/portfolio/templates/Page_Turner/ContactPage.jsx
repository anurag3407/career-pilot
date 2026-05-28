import React, { useState } from 'react'
import { Mail, Github, Linkedin, Sparkles, Send, PageFrame, safePersonal, safeSocials } from './shared'

const ContactPage = React.forwardRef(function ContactPage(_, ref) {
  const { email = '', github = '', linkedin = '', twitter = '' } = safeSocials
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const contactLinks = [
    { label: 'Email', value: email, href: email ? `mailto:${email}` : null, icon: Mail },
    { label: 'GitHub', value: github, href: github || null, icon: Github },
    { label: 'LinkedIn', value: linkedin, href: linkedin || null, icon: Linkedin },
    { label: 'Twitter', value: twitter, href: twitter || null, icon: Sparkles },
  ]

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email) return
    const params = new URLSearchParams({
      subject: 'Portfolio Inquiry',
      body: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    })
    window.location.href = `mailto:${email}?${params.toString()}`
  }

  return (
    <div ref={ref} className="h-full w-full bg-[#020617] overflow-hidden">
      <PageFrame pageNumber={6} totalPages={7} accent="#22d3ee">
        {/* Main container - Locked to 100% height */}
        <div className="flex flex-col h-full px-3 md:px-8 py-3 max-w-[1400px] mx-auto">
          
          {/* Header - Fixed to top */}
          <div className="shrink-0 mb-3">
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-cyan-400">// Chapter VI</div>
            <h2 className="text-xl md:text-2xl font-black text-white">Let's Connect</h2>
            <div className="mt-1 h-0.5 w-10 bg-gradient-to-r from-cyan-400 to-violet-500" />
          </div>

          {/* Scrollable Content Area - flex-1 min-h-0 is the magic fix for overflow */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-4 flex flex-col gap-4">
            
            {/* Form */}
            <div className="rounded-xl border border-slate-800 bg-[#080c14] p-4">
              <div className="mb-3 text-[11px] font-bold text-white uppercase tracking-wider">Send me a message</div>
              <form onSubmit={handleSubmit} className="space-y-2">
                <input value={form.name} onChange={(e) => setForm(c => ({...c, name: e.target.value}))} placeholder="NAME" className="w-full rounded border border-slate-800 bg-[#020617] px-3 py-2 text-[10px] text-white outline-none focus:border-cyan-500" />
                <input value={form.email} onChange={(e) => setForm(c => ({...c, email: e.target.value}))} placeholder="EMAIL" className="w-full rounded border border-slate-800 bg-[#020617] px-3 py-2 text-[10px] text-white outline-none focus:border-cyan-500" />
                <textarea value={form.message} onChange={(e) => setForm(c => ({...c, message: e.target.value}))} placeholder="MESSAGE" rows={3} className="w-full rounded border border-slate-800 bg-[#020617] px-3 py-2 text-[10px] text-white outline-none focus:border-cyan-500 resize-none" />
                <button type="submit" className="w-full bg-cyan-500 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-cyan-600 transition-colors">
                  Send Message
                </button>
              </form>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 gap-2">
              {contactLinks.map((item, i) => (
                item.href ? (
                  <a key={i} href={item.href} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-800 bg-[#080c14] p-3 text-white hover:border-cyan-500/30">
                    <div className="text-[8px] uppercase tracking-[0.2em] text-cyan-400/60">{item.label}</div>
                    <div className="mt-1 truncate text-[10px] font-bold">{item.value || 'N/A'}</div>
                  </a>
                ) : (
                  <div key={i} className="rounded-lg border border-slate-800 bg-[#080c14] p-3 text-white opacity-80">
                    <div className="text-[8px] uppercase tracking-[0.2em] text-cyan-400/60">{item.label}</div>
                    <div className="mt-1 truncate text-[10px] font-bold">{item.value || 'N/A'}</div>
                  </div>
                )
              ))}
            </div>

            {/* Colophon */}
            <div className="rounded-lg border border-slate-800 bg-[#080c14] p-4">
              <div className="text-[8px] uppercase tracking-[0.2em] text-cyan-400/60">Colophon</div>
              <div className="mt-1 text-[11px] font-black text-white">{safePersonal.name}</div>
              <p className="mt-1 text-[9px] text-slate-400">CareerPilot Portfolio v1.0. Built with React & Tailwind.</p>
            </div>
          </div>

        </div>
      </PageFrame>
    </div>
  )
})

export default ContactPage