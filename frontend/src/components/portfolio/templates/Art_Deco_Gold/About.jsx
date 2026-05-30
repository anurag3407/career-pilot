import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';

export default function About({ data }) {
  const { personal } = data;

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
            About
          </span>
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="rounded-[2rem] border border-amber-200/20 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-3 text-amber-200">
              <div className="rounded-full border border-amber-200/30 bg-amber-200/10 p-3">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70 font-semibold">
                  Signature story
                </p>
                <h2 className="mt-3 text-3xl font-serif font-black text-amber-100">
                  Elegance in every detail
                </h2>
              </div>
            </div>
            <p className="mt-8 text-base leading-relaxed text-amber-100/80">
              {personal.bio}
            </p>
          </div>

          <div className="rounded-[2rem] border border-amber-200/20 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="h-24 w-24 rounded-full border border-amber-200/30 object-cover"
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-amber-200/70 font-semibold">
                    Personal details
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-amber-100">
                    {personal.name}
                  </h3>
                  <p className="mt-2 text-sm text-amber-200/70">{personal.title}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/80 p-5 border border-amber-200/10">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Location</p>
                  <p className="mt-3 text-lg font-semibold text-amber-100 flex items-center gap-2">
                    <MapPin size={16} /> {personal.location}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5 border border-amber-200/10">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Style</p>
                  <p className="mt-3 text-lg font-semibold text-amber-100">Gatsby-inspired luxury</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
