import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, User } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function About({ data }) {
  const categories = [...new Set((data.skills || []).map((skill) => skill?.category).filter(Boolean))].slice(0, 3);

  return (
    <section className="px-5 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-1.5 text-sm text-indigo-300">
            <User size={15} strokeWidth={1.8} />
            About Me
          </div>

          <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Building Products That
            <span className="saas-gradient-text block">Actually Ship</span>
          </h2>

          <p className="mt-6 text-base leading-relaxed text-[#8884A8]">{data.personal?.bio}</p>

          <div className="mt-6 flex items-center gap-3 text-sm text-[#8884A8]">
            <MapPin size={18} className="text-[#6366F1]" strokeWidth={1.8} />
            <span>{data.personal?.location}</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#13131A] px-4 py-2 text-sm text-[#8884A8]"
              >
                <CheckCircle size={16} className="text-[#10B981]" strokeWidth={1.8} />
                {category}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-[#6366F1]/10 blur-3xl" />
          <div className="relative rounded-2xl border border-white/8 bg-[#1A1A24] p-5 shadow-2xl shadow-indigo-950/30">
            <div className="mb-5 flex items-center justify-between border-b border-white/8 pb-4">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
                <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                <span className="h-3 w-3 rounded-full bg-[#10B981]" />
              </div>
              <p className="font-mono text-xs text-[#4B4870]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                profile.json
              </p>
            </div>

            <div className="space-y-3 overflow-hidden font-mono text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              <p className="text-[#8884A8]">{'{'}</p>
              <p className="pl-4">
                <span className="text-[#6366F1]">&quot;name&quot;</span>
                <span className="text-[#8884A8]">: </span>
                <span className="text-[#10B981]">&quot;{data.personal?.name}&quot;</span>
                <span className="text-[#8884A8]">,</span>
              </p>
              <p className="pl-4">
                <span className="text-[#6366F1]">&quot;role&quot;</span>
                <span className="text-[#8884A8]">: </span>
                <span className="text-[#10B981]">&quot;{data.personal?.title}&quot;</span>
                <span className="text-[#8884A8]">,</span>
              </p>
              <p className="pl-4">
                <span className="text-[#6366F1]">&quot;location&quot;</span>
                <span className="text-[#8884A8]">: </span>
                <span className="text-[#10B981]">&quot;{data.personal?.location}&quot;</span>
                <span className="text-[#8884A8]">,</span>
              </p>
              <p className="pl-4">
                <span className="text-[#6366F1]">&quot;available&quot;</span>
                <span className="text-[#8884A8]">: </span>
                <span className="text-[#10B981]">true</span>
                <span className="text-[#8884A8]">,</span>
              </p>
              <p className="pl-4">
                <span className="text-[#6366F1]">&quot;skills&quot;</span>
                <span className="text-[#8884A8]">: </span>
                <span className="text-[#F59E0B]">{data.skills?.length || 0}</span>
                <span className="text-[#8884A8]"> listed</span>
              </p>
              <p className="text-[#8884A8]">{'}'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
