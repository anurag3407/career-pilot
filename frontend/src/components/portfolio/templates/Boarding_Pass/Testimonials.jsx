import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote, Star } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-10">
        <MessageSquareQuote className="w-6 h-6 text-stone-800" />
        <h2 className="text-2xl font-black text-stone-900 tracking-tighter uppercase">In-Flight Reviews</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((test, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-stone-50 border border-stone-200 rounded-xl p-6 relative group"
          >
            {/* Top right "Stamp" */}
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-red-500/20 flex items-center justify-center rotate-12 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="text-[8px] font-black text-red-500 uppercase tracking-widest text-center leading-none">Verified<br/>Passenger</span>
            </div>

            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <blockquote className="text-stone-700 italic mb-6 leading-relaxed relative z-10">
              "{test.text}"
            </blockquote>

            <div className="flex items-center gap-4 mt-auto border-t border-stone-200 pt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 shrink-0">
                <img src={test.avatar} alt={test.name} className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <p className="font-bold text-stone-900 uppercase text-sm">{test.name}</p>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{test.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
