import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="p-6 md:p-8">
      <h2 className="text-3xl font-bold text-white text-center mb-10">
        What People <span className="text-[#0078D4]">Say</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {data.testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="backdrop-blur-xl bg-white/[0.07] border border-white/15 rounded-xl p-5 flex flex-col gap-4"
          >
            <Quote size={28} className="text-[#0078D4] opacity-60" />
            <p className="text-white/70 text-sm leading-relaxed flex-1">"{t.text}"</p>
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0078D4]/30"
              />
              <div>
                <p className="text-white text-sm font-medium">{t.name}</p>
                <p className="text-white/40 text-xs">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
