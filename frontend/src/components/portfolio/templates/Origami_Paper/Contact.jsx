import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal) return null;

  return (
    <section className="relative overflow-hidden bg-[#f6f1e7] px-6 py-24 md:px-12 border-t-2 border-black/10">
      {/* Background origami shapes */}
      <div className="absolute top-1/4 right-[-5%] h-64 w-64 rotate-45 bg-[#efe6d6] border border-black/10 opacity-60" />
      <div className="absolute bottom-10 left-10 h-32 w-32 -rotate-12 bg-[#f1e3cc] border border-black/10 opacity-50" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-2 shadow-[4px_4px_0px_#000]">
            <Send size={16} />
            <span className="font-mono text-xs uppercase tracking-widest">
              Get in Touch
            </span>
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-black">
            Send a Message
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form side */}
          <div className="relative bg-white border-2 border-black p-8 shadow-[8px_8px_0px_#000]">
            {/* Fold Corner */}
            <div className="absolute top-0 right-0 h-12 w-12 bg-[#e9dcc7] border-b-2 border-l-2 border-black" />
            
            {/* Paper Shadow Layer */}
            <div className="absolute -bottom-3 -left-3 w-full h-full bg-[#efe6d6] border-2 border-black -z-10" />

            <h3 className="text-2xl font-bold mb-6">Write to me</h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-mono uppercase tracking-wider text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#f8f4ec] border-2 border-black p-3 outline-none focus:bg-white transition-colors"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-wider text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-[#f8f4ec] border-2 border-black p-3 outline-none focus:bg-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-wider text-gray-700 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-[#f8f4ec] border-2 border-black p-3 outline-none focus:bg-white transition-colors resize-none"
                  placeholder="How can we fold our ideas together?"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white font-bold py-4 border-2 border-black shadow-[4px_4px_0px_#cbb89d] hover:translate-y-1 hover:shadow-[2px_2px_0px_#cbb89d] transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details side */}
          <div className="flex flex-col justify-center space-y-8 pl-0 md:pl-8">
            <p className="text-xl text-gray-700 leading-relaxed italic font-serif">
              "Every great collaboration begins with a simple fold, a quick introduction, a shared idea."
            </p>

            <div className="space-y-6">
              {personal.email && (
                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center group-hover:-translate-y-1 group-hover:shadow-[5px_5px_0px_#000] transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${personal.email}`} className="text-black font-bold hover:underline decoration-2 underline-offset-4">
                      {personal.email}
                    </a>
                  </div>
                </div>
              )}
              
              {personal.phone && (
                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center group-hover:-translate-y-1 group-hover:shadow-[5px_5px_0px_#000] transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                    <p className="text-black font-bold">{personal.phone}</p>
                  </div>
                </div>
              )}

              {personal.location && (
                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center group-hover:-translate-y-1 group-hover:shadow-[5px_5px_0px_#000] transition-all">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-1">Location</p>
                    <p className="text-black font-bold">{personal.location}</p>
                  </div>
                </div>
              )}
            </div>

            {socials && socials.length > 0 && (
              <div className="pt-8 border-t-2 border-dashed border-black/20">
                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Find me elsewhere</p>
                <div className="flex flex-wrap gap-4">
                  {socials.map((social, idx) => (
                    <a 
                      key={idx} 
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border-2 border-black px-4 py-2 font-bold text-sm shadow-[3px_3px_0px_#000] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#000] transition-all"
                    >
                      {social.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
