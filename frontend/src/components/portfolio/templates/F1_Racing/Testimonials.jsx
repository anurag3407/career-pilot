import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Mic, Headset, MessageSquare } from 'lucide-react';

export default function Testimonials({ data }) {
  let testimonials = data?.testimonials;
  if (!testimonials || testimonials.length === 0) return null;
  if (typeof testimonials === 'string') {
    testimonials = [{ author: "Colleague", content: testimonials, role: "Team Member" }];
  }

  return (
    <section id="testimonials" className="relative py-20 bg-[#070709] border-b border-neutral-900 text-white overflow-hidden selection:bg-[#E10600] selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      <div className="absolute left-0 top-1/4 w-[400px] h-[400px] bg-[#ffe600]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col items-center mb-16 text-center space-y-4">
          <div className="inline-flex items-center bg-neutral-900/80 backdrop-blur-sm border-l-4 border-[#ffe600] px-3 py-1.5 text-xs font-mono text-neutral-300 gap-2 uppercase tracking-widest">
            <Radio className="w-4 h-4 text-[#ffe600] animate-pulse" />
            <span>Pit Wall Communications</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase italic transform -skew-x-12">
            <span className="block text-white">TEAM RADIO &</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffe600] to-[#ccb800]">
              FEEDBACK
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#121216]/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 group hover:border-neutral-700 transition-all relative overflow-hidden"
            >
              {/* Audio wave decorative element */}
              <div className="absolute top-6 right-6 flex items-end gap-1 opacity-20 group-hover:opacity-60 transition-opacity">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <motion.div
                    key={bar}
                    animate={{ height: [10, Math.random() * 20 + 10, 10] }}
                    transition={{ repeat: Infinity, duration: 0.8 + Math.random(), ease: "easeInOut" }}
                    className="w-1 bg-[#ffe600] rounded-t-sm"
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-400">
                  <Headset className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono tracking-tight text-white uppercase flex items-center gap-2">
                    {t.author} 
                    {t.role && (
                      <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-sm tracking-widest">
                        {t.role}
                      </span>
                    )}
                  </h3>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                    <Mic className="w-3 h-3 text-[#ffe600]" /> TRANSMITTING
                  </div>
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute -top-2 -left-2 w-6 h-6 text-neutral-800 -z-10" />
                <p className="text-neutral-300 italic font-sans leading-relaxed text-sm md:text-base pl-2 border-l-2 border-[#ffe600]/30 py-1">
                  "{t.content}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}