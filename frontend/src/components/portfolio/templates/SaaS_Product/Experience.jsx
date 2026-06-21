import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function Experience({ data }) {
  return (
    <section id="experience" className="bg-[#0D0D12] px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-1.5 text-sm text-indigo-300">
            <Briefcase size={15} strokeWidth={1.8} />
            Experience
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Career Journey</h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-[#6366F1]/20 md:left-1/2" />
          <div className="space-y-8">
            {(data.experience || []).map((job, index) => (
              <motion.div
                key={`${job?.role}-${job?.company}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -36 : 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: index * 0.08, ease }}
                className={`relative pl-12 md:w-1/2 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:ml-auto md:pl-12'}`}
              >
                <span className="absolute left-[0.7rem] top-6 h-3 w-3 rounded-full border-2 border-white bg-[#6366F1] md:left-auto md:right-[-0.4rem]" />
                {index % 2 !== 0 ? (
                  <span className="absolute top-6 hidden h-3 w-3 rounded-full border-2 border-white bg-[#6366F1] md:left-[-0.35rem] md:block" />
                ) : null}
                <motion.article
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="rounded-xl border border-white/8 bg-[#13131A] p-6 transition hover:border-[#6366F1]/30 hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[#F1F0FF]">{job?.role}</h3>
                    {index === 0 ? (
                      <span className="rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-2.5 py-1 text-xs font-medium text-[#10B981]">
                        Current
                      </span>
                    ) : null}
                  </div>
                  <p className="font-medium text-indigo-400">{job?.company}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-[#4B4870]">
                    <Calendar size={14} strokeWidth={1.8} />
                    {job?.period}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#8884A8]">{job?.description}</p>
                  <div className="mt-5 border-t border-white/5 pt-4 text-xs uppercase tracking-[0.25em] text-[#4B4870]">
                    {job?.company}
                  </div>
                </motion.article>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
