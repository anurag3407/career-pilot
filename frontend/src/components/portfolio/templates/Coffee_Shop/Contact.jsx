import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone, Coffee } from 'lucide-react';
import { usePortfolio } from "../../../../context/PortfolioContext";

const Contact = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData?.personal || portfolioData?.personalInfo || {};
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="w-full bg-[#161210] py-24 relative font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="bg-[#1e1511] border-[6px] border-[#3e271a] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row relative">
          
          {/* Wood Screws */}
          <div className="absolute top-3 left-3 w-3 h-3 bg-[#161210] rounded-full border border-[#2d1a12] shadow-inner z-20" />
          <div className="absolute top-3 right-3 w-3 h-3 bg-[#161210] rounded-full border border-[#2d1a12] shadow-inner z-20" />
          <div className="absolute bottom-3 left-3 w-3 h-3 bg-[#161210] rounded-full border border-[#2d1a12] shadow-inner z-20" />
          <div className="absolute bottom-3 right-3 w-3 h-3 bg-[#161210] rounded-full border border-[#2d1a12] shadow-inner z-20" />

          {/* Left: Contact Info (Chalkboard Menu Style) */}
          <div className="w-full md:w-2/5 bg-[#2d1a12] p-12 flex flex-col justify-between border-b-[6px] md:border-b-0 md:border-r-[6px] border-[#3e271a] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,transparent_100%)] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-amber-400 font-serif uppercase tracking-widest mb-4 drop-shadow-md">
                Drop A Line
              </h2>
              <p className="text-amber-100/70 font-serif text-base mb-10 font-medium italic">
                "Whether you need a full-stack brew or just a quick espresso shot of advice, the counter is open."
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 bg-[#161210] rounded-full flex items-center justify-center border-2 border-amber-900 group-hover:border-amber-500 transition-colors shadow-lg">
                    <Mail className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="font-mono text-sm text-stone-300 font-bold tracking-wider">{personalInfo.email || 'hello@coffeeshop.dev'}</span>
                </div>
                
                {personalInfo.phone && (
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 bg-[#161210] rounded-full flex items-center justify-center border-2 border-amber-900 group-hover:border-amber-500 transition-colors shadow-lg">
                      <Phone className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="font-mono text-sm text-stone-300 font-bold tracking-wider">{personalInfo.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 bg-[#161210] rounded-full flex items-center justify-center border-2 border-amber-900 group-hover:border-amber-500 transition-colors shadow-lg">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="font-mono text-sm text-stone-300 font-bold tracking-wider">{personalInfo.location || 'San Francisco, CA'}</span>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-6 border-t border-dashed border-[#5c4033] text-stone-500 text-xs font-mono font-black uppercase tracking-widest flex items-center justify-center gap-2 relative z-10">
              <Coffee className="w-5 h-5 text-[#5c4033]" /> 100% Handcrafted Code
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full md:w-3/5 p-12 bg-[#1e1511] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,26,18,0.4),transparent)] pointer-events-none" />
            
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-5 animate-[fadeIn_0.5s_ease-out] relative z-10 py-20">
                <div className="w-20 h-20 bg-emerald-950/40 border-2 border-emerald-800 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  <Send className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black text-emerald-400 font-serif uppercase tracking-widest">Order Received!</h3>
                <p className="text-stone-400 font-mono text-base font-bold">We'll get back to you faster than an espresso shot.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-mono font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                      Your Name
                    </label>
                    <input 
                      required 
                      className="w-full bg-[#161210] border-2 border-[#3e271a] rounded-xl px-5 py-4 text-stone-200 text-sm font-mono focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-mono font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                      Email Address
                    </label>
                    <input 
                      required 
                      type="email"
                      className="w-full bg-[#161210] border-2 border-[#3e271a] rounded-xl px-5 py-4 text-stone-200 text-sm font-mono focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                    What's brewing?
                  </label>
                  <textarea 
                    required 
                    rows={5}
                    className="w-full bg-[#161210] border-2 border-[#3e271a] rounded-xl px-5 py-4 text-stone-200 text-sm font-mono focus:outline-none focus:border-amber-500 transition-colors resize-none shadow-inner leading-relaxed"
                    placeholder="Tell me about your project, timeline, or just say hi..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-[#161210] font-black font-mono text-base uppercase tracking-widest py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.01] shadow-[0_5px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.35)] cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  Submit Project Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
