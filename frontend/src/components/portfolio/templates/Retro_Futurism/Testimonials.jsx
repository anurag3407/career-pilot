import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import SectionHeading from './SectionHeading';
import data from '../../../../data/dummy_data.json';

const FALLBACK_AVATAR = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="64" fill="#111827" />
    <circle cx="64" cy="50" r="22" fill="#f472b6" />
    <path d="M24 116c7-21 26-33 40-33s33 12 40 33" fill="#22d3ee" />
  </svg>`
)}`;

export default function Testimonials() {
  return (
    <section>
      <SectionHeading><Star size={36} className="text-cyan-400" /> User Feedback</SectionHeading>
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        {data.testimonials.map((test) => (
          <motion.div key={test.id ?? `${test.name}-${test.role}`} whileHover={{ y: -8, scale: 1.05 }} className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500 p-6 rounded-xl backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <MessageSquare size={48} className="text-cyan-500" />
            </div>
            <p className="text-slate-300 text-xs sm:text-sm italic mb-6 relative z-10">"{test.text}"</p>
            <div className="flex items-center gap-4 relative z-10">
              <img
                src={test.avatar}
                alt={test.name || "Profile Avatar"}
                onError={(event) => {
                  const target = event.currentTarget;
                  if (target.dataset.fallbackApplied === 'true') {
                    return;
                  }
                  target.dataset.fallbackApplied = 'true';
                  target.src = FALLBACK_AVATAR;
                }}
                className="w-12 h-12 rounded-full border-2 border-pink-500"
              />
              <div>
                <h4 className="text-pink-400 font-bold text-xs sm:text-sm">{test.name}</h4>
                <span className="text-slate-500 text-[11px] sm:text-xs">{test.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
