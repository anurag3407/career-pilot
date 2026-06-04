import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Globe, Linkedin, Github, Twitter, Mail } from 'lucide-react';

export default function About({ personal, socials }) {
  const socialIcons = {
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    email: <Mail className="w-5 h-5" />
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm relative overflow-hidden"
      >
        {/* Decorative corner brackets (Customs Form feel) */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-stone-800 m-4" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-stone-800 m-4" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-stone-800 m-4" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-stone-800 m-4" />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Globe className="w-96 h-96" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase mb-1">Customs Declaration</h2>
              <div className="w-full h-1 bg-stone-900 mb-2" />
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Form 734-B • Passenger Information</p>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-sm">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Declared Purpose of Visit</span>
                <p className="text-stone-800 font-medium italic">"{personal.tagline}"</p>
              </div>

              <div className="prose prose-stone max-w-none">
                <p className="text-stone-600 leading-relaxed">
                  {personal.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Biometrics & Comm Links */}
          <div className="w-full md:w-64 shrink-0 space-y-8">
            <div className="border-2 border-dashed border-stone-300 p-6 flex flex-col items-center justify-center bg-stone-50/50">
              <Fingerprint className="w-16 h-16 text-blue-600/20 mb-3" />
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">Biometric<br/>Verified</span>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 border-b border-stone-200 pb-2">Comms Frequency</span>
              <div className="flex flex-col gap-3">
                {Object.entries(socials).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={platform}
                      href={platform === 'email' ? `mailto:${url}` : url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-stone-100 hover:bg-stone-800 hover:text-white transition-colors border border-stone-200 text-stone-600"
                    >
                      {socialIcons[platform] || <Globe className="w-5 h-5" />}
                      <span className="text-xs font-bold uppercase tracking-wider">{platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
