import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

export default function Testimonials({ data, isMaximized }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <h2 className={`font-bold text-white text-center ${isMaximized ? 'text-4xl mb-12' : 'text-2xl md:text-3xl mb-8'}`}>
        What People <span className="text-[#0078D4]">Say</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {(data.testimonials ?? []).map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`backdrop-blur-xl bg-white/[0.07] border border-white/15 rounded-xl flex flex-col gap-4 ${isMaximized ? 'p-7' : 'p-5'}`}
          >
            <Quote size={28} className="text-[#0078D4] opacity-60" />
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={isMaximized ? 16 : 14} className="fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className={`text-white/70 italic mb-6 leading-relaxed flex-1 ${isMaximized ? 'text-base' : 'text-sm'}`}>
              "{t?.text}"
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <img
                src={t?.avatar}
                alt={t?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0078D4]/30"
              />
              <div>
                <h4 className={`font-semibold text-white ${isMaximized ? 'text-base md:text-lg' : 'text-sm'}`}>{t?.name}</h4>
                <p className={`text-white/50 ${isMaximized ? 'text-sm' : 'text-xs'}`}>{t?.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
