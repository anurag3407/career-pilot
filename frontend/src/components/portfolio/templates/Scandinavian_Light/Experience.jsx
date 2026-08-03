import React from 'react';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, CalendarDays } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function Experience({ data }) {
  return (
    <section className="bg-[#F7F3EA] px-5 py-24 md:px-8 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-12 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#8FA58A]">
            <BriefcaseBusiness size={16} />
            Experience
          </p>
          <h2 className="scandi-serif mt-4 text-4xl font-semibold text-[#283028] md:text-5xl">
            A steady path of useful product work.
          </h2>
        </div>

        <div className="relative space-y-5">
          <div className="absolute left-5 top-4 h-[calc(100%-2rem)] w-px bg-[#D9C3A8] md:left-1/2" />
          {(data.experience || []).map((job, index) => (
            <motion.article
              key={`${job?.role || 'role'}-${job?.company || 'company'}-${index}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.05, ease }}
              className={`relative pl-12 md:w-1/2 md:pl-0 ${
                index % 2 === 0 ? 'md:pr-10' : 'md:ml-auto md:pl-10'
              }`}
            >
              <span
                className={`absolute left-[0.85rem] top-7 h-3 w-3 rounded-full border-2 border-[#FFFDF8] bg-[#C58A63] ${
                  index % 2 === 0
                    ? 'md:left-auto md:right-[-0.4rem]'
                    : 'md:left-[-0.35rem]'
                }`}
              />

              <div className="rounded-[1.5rem] border border-[#E7DED1] bg-[#FFFDF8] p-6 shadow-[0_18px_55px_rgba(70,56,39,0.07)]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7D6B]">
                  <CalendarDays size={15} />
                  {job?.period}
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#283028]">{job?.role}</h3>
                <p className="mt-1 font-semibold text-[#315343]">{job?.company}</p>
                <p className="mt-4 text-sm leading-7 text-[#6F746B]">{job?.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
