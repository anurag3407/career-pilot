import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Testimonials({ testimonials }) {
  return (
    <section id="testimonials" className="py-10 px-4 md:px-12">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-white text-xl md:text-2xl font-bold tracking-wide mb-8"
      >
        ⭐ What People Say
      </motion.h2>

      {/* Horizontal scroll */}
      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="flex-shrink-0 w-80 md:w-96 bg-[#1f1f1f] rounded-xl p-6 border border-white/5 hover:border-[#E50914]/30 transition-all duration-300"
          >
            {/* Quote icon */}
            <div className="w-8 h-8 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center mb-4">
              <Quote className="w-4 h-4 text-[#E50914]" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <span key={j} className="text-[#E50914] text-sm">★</span>
              ))}
            </div>

            {/* Quote text */}
            <p className="text-[#e5e5e5] text-sm leading-relaxed mb-6 italic">
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#E50914]/40"
              />
              <div>
                <p className="text-white text-sm font-bold">{t.name}</p>
                <p className="text-[#737373] text-xs">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
