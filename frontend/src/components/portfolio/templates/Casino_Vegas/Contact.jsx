import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact({ data }) {
  const contact = data?.contact || {};
  
  return (
    <section className="relative overflow-hidden bg-black py-24 px-6 text-white">
      {/* Background glow */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-red-600/10 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.9)]">
            Place Your Bet
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Let's build something jackpot-worthy. Contact me today.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Info Side */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-[32px] border border-yellow-500/30 bg-white/[0.03] p-8 backdrop-blur-lg">
              <h3 className="mb-8 text-2xl font-bold uppercase tracking-wider text-yellow-300">
                Contact Info
              </h3>
              
              <div className="space-y-6">
                {contact.email && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-yellow-400 transition-colors break-all">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href={`tel:${contact.phone}`} className="text-gray-300 hover:text-red-400 transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact.location && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <span className="text-gray-300">
                        {contact.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-3">
            <form className="rounded-[32px] border border-yellow-500/30 bg-white/[0.03] p-8 backdrop-blur-lg shadow-[0_0_40px_rgba(250,204,21,0.05)]">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-yellow-400/80">Name</label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-5 py-4 text-white placeholder-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-yellow-400/80">Email</label>
                  <input 
                    type="email" 
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-5 py-4 text-white placeholder-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-yellow-400/80">Message</label>
                <textarea 
                  rows="4"
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/50 px-5 py-4 text-white placeholder-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button 
                type="button"
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-yellow-400 to-red-500 px-8 py-4 font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]"
              >
                Send Message
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
