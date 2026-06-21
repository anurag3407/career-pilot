import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

function getPercent(level) {
  if (typeof level === 'number') {
    return Math.max(0, Math.min(100, level));
  }

  const normalized = String(level || '').toLowerCase();
  const map = {
    expert: 92,
    advanced: 80,
    intermediate: 65,
    beginner: 40,
  };

  return map[normalized] || 60;
}

function levelDot(level) {
  const percent = getPercent(level);
  if (percent >= 80) {
    return 'bg-[#10B981]';
  }
  if (percent >= 60) {
    return 'bg-[#6366F1]';
  }
  return 'bg-[#4B4870]';
}

export default function Skills({ data }) {
  const groupedSkills = (data.skills || []).reduce((groups, skill) => {
    const category = skill?.category || 'General';
    return {
      ...groups,
      [category]: [...(groups[category] || []), skill],
    };
  }, {});

  const topSkills = [...(data.skills || [])]
    .sort((a, b) => getPercent(b?.level) - getPercent(a?.level))
    .slice(0, 6);

  return (
    <section className="bg-[#0D0D12] px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-1.5 text-sm text-indigo-300">
            <Zap size={15} strokeWidth={1.8} />
            Tech Stack
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Tools & Technologies</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-5 md:grid-cols-2">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <motion.div
                key={category}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-white/8 bg-[#13131A] p-6 transition-colors hover:border-[#2E2E42]"
              >
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#4B4870]">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {(skills || []).map((skill) => (
                    <span
                      key={skill?.name}
                      className="inline-flex items-center gap-2 rounded-md border border-white/8 bg-[#0D0D12] px-3 py-1.5 font-mono text-sm text-[#8884A8]"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      <span className={`h-2 w-2 rounded-full ${levelDot(skill?.level)}`} />
                      {skill?.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#13131A] p-6">
            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-[#4B4870]">Proficiency</p>
            <div className="space-y-6">
              {topSkills.map((skill) => {
                const percent = getPercent(skill?.level);

                return (
                  <div key={skill?.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-[#F1F0FF]">{skill?.name}</span>
                      <span className="font-mono text-[#8884A8]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {percent}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#1A1A24]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease }}
                        className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
