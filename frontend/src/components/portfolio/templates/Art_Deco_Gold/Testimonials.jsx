import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function Testimonials({ data }) {
  const testimonials = data.testimonials || [];

  return (
    <section className="relative px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
          <span className="text-[10px] tracking-[0.35em] uppercase text-amber-200/70 font-semibold">
            Testimonials
          </span>
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((item, index) => (
            <motion.article
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.06 }}
              className="rounded-[2rem] border border-amber-200/20 bg-slate-900/75 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.3)]"
            >
              <div className="flex items-center gap-3 text-amber-100">
                <div className="rounded-full border border-amber-200/20 bg-amber-200/10 p-3">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-black text-amber-100">
                    {item.name}
                  </h3>
                  <p className="text-sm uppercase tracking-[0.28em] text-amber-200/70">
                    {item.role}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-amber-100/80">
                {item.text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
