import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

function getPercent(level) {
  if (typeof level === 'number') return Math.max(0, Math.min(100, level));

  const value = String(level || '').toLowerCase();
  const map = {
    expert: 92,
    advanced: 82,
    intermediate: 66,
    beginner: 42,
  };
  return map[value] || 60;
}

export default function Skills({ data }) {
  const groupedSkills = (data.skills || []).reduce((groups, skill) => {
    const category = skill?.category || 'General';
    if (!groups[category]) groups[category] = [];
    groups[category].push(skill);
    return groups;
  }, {});

  return (
    <section className="bg-[#F7F3EA] px-5 py-24 md:px-8 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#8FA58A]">
              <Leaf size={16} />
              Skills
            </p>
            <h2 className="scandi-serif mt-4 text-4xl font-semibold text-[#283028] md:text-5xl">
              A practical toolkit, organized by craft.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#6F746B]">
            Soft visual structure, clear labels, and animated bars keep the section easy to scan.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <motion.article
              key={category}
              whileHover={{ y: -6 }}
              className="rounded-[1.5rem] border border-[#E7DED1] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(70,56,39,0.07)]"
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#C58A63]">{category}</h3>
              <div className="mt-5 space-y-4">
                {(skills || []).map((skill) => {
                  const percent = getPercent(skill?.level);
                  return (
                    <div key={skill?.name}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-[#283028]">{skill?.name}</span>
                        <span className="text-xs font-medium text-[#8B7D6B]">{percent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#ECE5DA]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease }}
                          className="h-full rounded-full bg-gradient-to-r from-[#8FA58A] to-[#315343]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
