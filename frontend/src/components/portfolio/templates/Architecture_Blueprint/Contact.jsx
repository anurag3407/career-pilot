import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Mail, Phone, MapPin, Send, Share2 } from 'lucide-react';

export default function Contact() {
  const { portfolioData: data } = usePortfolio();
  
  if (!data?.contact) return null;

  return (
    <section id="contact" className="relative w-full bg-[#030e1a] py-24 px-6 md:px-16 font-mono text-cyan-50 border-t border-cyan-900/50">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16">
        
        {/* Left Info Panel */}
        <div className="w-full lg:w-5/12 flex flex-col">
          <div className="flex items-center gap-4 text-cyan-400 text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
            <span className="w-12 h-px bg-cyan-400"></span>
            <span>Comms Link: Status Active</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tight text-cyan-50 mb-8">
            Establish <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Connection</span>
          </h2>

          <p className="text-cyan-100/70 mb-12 leading-relaxed border-l-2 border-cyan-800 pl-6">
            Ready to initiate a new project protocol? Open a communication channel below to transmit project parameters and begin the drafting phase.
          </p>

          <div className="space-y-8">
            {data.contact.email && (
              <div className="flex items-start gap-6 group">
                <div className="p-3 border border-cyan-800 bg-[#030e1a] group-hover:border-cyan-400 group-hover:bg-cyan-950/40 transition-colors relative">
                  <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-400"></div>
                  <Mail className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-xs text-cyan-600 uppercase tracking-widest font-bold mb-1">Secure Email</h4>
                  <a href={`mailto:${data.contact.email}`} className="text-lg text-cyan-200 hover:text-cyan-400 transition-colors">
                    {data.contact.email}
                  </a>
                </div>
              </div>
            )}
            
            {data.contact.phone && (
              <div className="flex items-start gap-6 group">
                <div className="p-3 border border-cyan-800 bg-[#030e1a] group-hover:border-cyan-400 group-hover:bg-cyan-950/40 transition-colors relative">
                  <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-400"></div>
                  <Phone className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-xs text-cyan-600 uppercase tracking-widest font-bold mb-1">Voice Protocol</h4>
                  <a href={`tel:${data.contact.phone}`} className="text-lg text-cyan-200 hover:text-cyan-400 transition-colors">
                    {data.contact.phone}
                  </a>
                </div>
              </div>
            )}

            {data.contact.location && (
              <div className="flex items-start gap-6 group">
                <div className="p-3 border border-cyan-800 bg-[#030e1a] group-hover:border-cyan-400 group-hover:bg-cyan-950/40 transition-colors relative">
                  <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-400"></div>
                  <MapPin className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-xs text-cyan-600 uppercase tracking-widest font-bold mb-1">Coordinates</h4>
                  <span className="text-lg text-cyan-200">{data.contact.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* Social Links Network Node */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="mt-16 pt-10 border-t border-cyan-900/40 relative">
              <div className="absolute top-0 left-0 w-8 h-px bg-cyan-500"></div>
              <h4 className="flex items-center gap-2 text-xs text-cyan-600 uppercase tracking-widest font-bold mb-6">
                <Share2 className="w-4 h-4" /> Global Network Relays
              </h4>
              <div className="flex flex-wrap gap-4">
                {data.socialLinks.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-cyan-800/60 text-cyan-400 hover:bg-cyan-900/30 hover:border-cyan-400 transition-all text-sm uppercase tracking-wider flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-cyan-800 group-hover:bg-cyan-400"></span>
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-7/12 relative">
          <div className="absolute inset-0 border border-cyan-800/50 bg-[#030e1a]/80 backdrop-blur-md"></div>
          
          {/* Tech Corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>

          <form className="relative z-10 p-8 md:p-12 space-y-6">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-4 mb-8">
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm">Transmission Form</span>
              <span className="text-[10px] text-cyan-600 font-mono tracking-widest bg-cyan-950/50 px-2 py-1">SECURE_LINK_256</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 bg-cyan-600"></span> Identity Label
                </label>
                <input 
                  type="text" 
                  className="w-full bg-[#030e1a] border border-cyan-800/60 p-3 text-cyan-100 placeholder-cyan-800 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm"
                  placeholder="Enter Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 bg-cyan-600"></span> Return Address
                </label>
                <input 
                  type="email" 
                  className="w-full bg-[#030e1a] border border-cyan-800/60 p-3 text-cyan-100 placeholder-cyan-800 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm"
                  placeholder="Enter Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 bg-cyan-600"></span> Subject Matter
              </label>
              <input 
                type="text" 
                className="w-full bg-[#030e1a] border border-cyan-800/60 p-3 text-cyan-100 placeholder-cyan-800 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm"
                placeholder="Transmission Subject"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 bg-cyan-600"></span> Payload Data
              </label>
              <textarea 
                rows="5"
                className="w-full bg-[#030e1a] border border-cyan-800/60 p-3 text-cyan-100 placeholder-cyan-800 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm resize-none"
                placeholder="Enter Message Details..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full group relative px-8 py-4 bg-cyan-900/30 border border-cyan-500 text-cyan-300 font-bold uppercase tracking-widest overflow-hidden hover:bg-cyan-800/50 transition-all duration-300 mt-4"
              onClick={(e) => e.preventDefault()}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Transmit Data
              </span>
              {/* Scanning line animation */}
              <div className="absolute top-0 left-0 w-full h-px bg-cyan-400/50 -translate-y-full group-hover:translate-y-[60px] transition-transform duration-1000 ease-in-out"></div>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
