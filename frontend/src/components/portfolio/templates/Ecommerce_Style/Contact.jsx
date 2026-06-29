import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function Contact({ data }) {
  const { personal, socials } = data || {};
  if (!personal) return null;

  return (
    <section className="relative py-24 bg-stone-900 text-stone-50 overflow-hidden px-5">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Support / Contact info */}
          <div>
            <div className="inline-flex items-center gap-2 border border-stone-700 bg-stone-800/50 rounded-full px-5 py-2 mb-6">
              <MessageCircle size={16} className="text-orange-400" />
              <span className="text-sm font-semibold text-stone-300">Customer Support</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Let's build <br />
              <span className="text-stone-400">something great.</span>
            </h2>
            
            <p className="text-stone-400 text-lg mb-10 max-w-md">
              Have a project in mind or need assistance? Reach out to our dedicated support team. We're here to help 24/7.
            </p>

            <div className="space-y-6">
              {personal.email && (
                <a href={`mailto:${personal.email}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors">
                    <Mail size={20} className="text-stone-300 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Email Us</p>
                    <p className="text-lg font-medium text-stone-200 group-hover:text-white">{personal.email}</p>
                  </div>
                </a>
              )}
              
              {personal.phone && (
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors">
                    <Phone size={20} className="text-stone-300 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Call Us</p>
                    <p className="text-lg font-medium text-stone-200 group-hover:text-white">{personal.phone}</p>
                  </div>
                </div>
              )}

              {personal.location && (
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors">
                    <MapPin size={20} className="text-stone-300 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-lg font-medium text-stone-200 group-hover:text-white">{personal.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Newsletter / Contact Form */}
          <div className="bg-stone-800/40 backdrop-blur-xl border border-stone-700 rounded-[32px] p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-2">Subscribe to Newsletter</h3>
            <p className="text-stone-400 mb-8">Get the latest updates, drops, and insights delivered straight to your inbox.</p>
            
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Message (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="How can we help?"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition resize-none"
                />
              </div>
              
              <button className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/25">
                Subscribe & Send <Send size={18} />
              </button>
            </form>
          </div>

        </div>
        
        {/* Footer Area */}
        <div className="mt-24 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 font-medium text-sm">
            © {new Date().getFullYear()} {personal.name}. All rights reserved.
          </p>
          
          {socials && socials.length > 0 && (
            <div className="flex gap-4">
              {socials.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone-500 hover:text-white transition-colors text-sm font-semibold"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
