import React from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Github, Linkedin, Twitter } from 'lucide-react';

export default function Contact({ data }) {
  const { personalInfo } = data || {};
  const email = personalInfo?.email || 'explorer@cartography.net';
  const location = personalInfo?.location || 'Unknown Coordinates';

  return (
    <section className="w-full py-24 px-6 md:px-16 mb-20 relative">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-4xl font-black mb-16 text-center text-[#2e1d16] tracking-widest uppercase font-serif">
          <span className="border-b-2 border-dotted border-[#5d4037] pb-2 px-8 inline-block">Dispatch a Missive</span>
        </h3>

        <div className="bg-[#e8dac1] p-8 md:p-12 rounded shadow-[5px_5px_15px_rgba(62,39,35,0.2)] border-2 border-[#8d6e63] relative">
          {/* Wax seal decoration */}
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#8b0000] rounded-full shadow-lg flex items-center justify-center border-2 border-[#5a0000] z-20">
            <div className="w-16 h-16 border border-[#ffcccc] rounded-full opacity-50 flex items-center justify-center">
              <span className="text-[#ffcccc] font-serif text-2xl font-bold">M</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            <div>
              <h4 className="text-2xl font-serif text-[#2e1d16] mb-6 italic border-b border-[#c4a482] pb-2">Carrier Pigeon Route</h4>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Mail className="w-6 h-6 text-[#5d4037]" />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[#8d6e63] font-bold mb-1">Postbox</p>
                    <p className="text-[#3e2723] font-serif text-lg">{email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <MapPin className="w-6 h-6 text-[#5d4037]" />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[#8d6e63] font-bold mb-1">Current Outpost</p>
                    <p className="text-[#3e2723] font-serif text-lg">{location}</p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#c4a482]">
                  <p className="text-xs tracking-widest uppercase text-[#8d6e63] font-bold mb-4">Telegraph Channels</p>
                  <div className="flex gap-4">
                    {[Github, Linkedin, Twitter].map((Icon, idx) => (
                      <a 
                        key={idx}
                        href="#" 
                        className="w-10 h-10 border border-[#8d6e63] flex items-center justify-center text-[#5d4037] hover:bg-[#5d4037] hover:text-[#f4ebd8] transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8d6e63] mb-2">Sender's Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#f4ebd8] border border-[#c4a482] px-4 py-3 text-[#3e2723] font-serif focus:outline-none focus:border-[#5d4037] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8d6e63] mb-2">Sender's Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-[#f4ebd8] border border-[#c4a482] px-4 py-3 text-[#3e2723] font-serif focus:outline-none focus:border-[#5d4037] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#8d6e63] mb-2">The Missive</label>
                  <textarea 
                    rows="4"
                    className="w-full bg-[#f4ebd8] border border-[#c4a482] px-4 py-3 text-[#3e2723] font-serif focus:outline-none focus:border-[#5d4037] transition-colors resize-none"
                  ></textarea>
                </div>
                <button type="button" className="w-full py-4 border-2 border-[#5d4037] text-[#5d4037] font-bold tracking-widest uppercase hover:bg-[#5d4037] hover:text-[#f4ebd8] transition-colors flex items-center justify-center gap-2">
                  <span>Dispatch</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
