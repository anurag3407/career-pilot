import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, ArrowRight, Briefcase, Calendar } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const F = {
  bg:       '#faf9f7',
  surface:  '#f2efe9',
  dark:     '#0a0a0a',
  charcoal: '#1a1a1a',
  muted:    '#6b6b6b',
  subtle:   '#b0b0b0',
  gold:     '#c9a84c',
  goldLight:'#e8c96e',
  cream:    '#f7f3ed',
  border:   '#e0dbd4',
};

function ExperienceRow({ job, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-start gap-5 py-5"
      style={{ borderBottom: `1px solid ${F.border}` }}>
      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
        style={{ background: index === 0 ? F.dark : F.surface, color: index === 0 ? F.gold : F.muted, border: `1px solid ${F.border}` }}>
        <Briefcase size={14} />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-black tracking-tight" style={{ color: F.charcoal }}>{job.role}</h4>
            <p className="text-xs font-semibold mt-0.5" style={{ color: F.gold }}>{job.company}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar size={10} style={{ color: F.subtle }} />
            <span className="text-xs" style={{ color: F.subtle }}>{job.duration}</span>
          </div>
        </div>
        {job.description && (
          <p className="text-xs leading-relaxed mt-2" style={{ color: F.muted }}>{job.description}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function ResumeCTA() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} style={{ background: F.dark, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="flex items-center justify-between px-5 md:px-16 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2" style={{ background: F.gold }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Experience & Resume
          </span>
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>§ 05</span>
      </motion.div>

      <div className="grid lg:grid-cols-2">

        {/* Left — CTA */}
        <div className="px-5 md:px-16 py-10 md:py-14" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: F.gold }}>
            — Full Curriculum Vitae
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="font-black tracking-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', lineHeight: 1.1 }}>
            {data.stats.yearsExperience}+ Years of
            <span className="block italic"
              style={{ background: `linear-gradient(135deg, ${F.gold}, ${F.goldLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Craft
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-sm leading-relaxed mb-10 max-w-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            A track record of shipping high-impact products at scale — from early-stage startups to enterprise platforms.
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {[
              { value: `${data.stats.yearsExperience}+`, label: 'Years' },
              { value: `${data.stats.projectsCompleted}+`, label: 'Projects' },
              { value: `${data.stats.happyClients}+`, label: 'Clients' },
              { value: `${data.skills.length}+`, label: 'Skills' },
            ].map(({ value, label }) => (
              <div key={label} className="px-5 py-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-2xl font-black" style={{ color: F.gold }}>{value}</p>
                <p className="text-xs uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Download button */}
          <motion.a
            href={data.personal.resumeUrl || '#'}
            target="_blank" rel="noopener noreferrer"
            whileHover={{ backgroundColor: F.gold }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-3 px-8 py-4 text-sm font-black uppercase tracking-widest"
            style={{ background: F.gold, color: F.dark }}>
            <Download size={14} />
            Download Resume
          </motion.a>

          <motion.a
            href={`mailto:${data.socials.email}`}
            whileHover={{ color: F.gold }}
            transition={{ duration: 0.2 }}
            className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            Or get in touch directly
            <ArrowRight size={12} />
          </motion.a>
        </div>

        {/* Right — experience timeline */}
        <div className="px-5 md:px-16 py-10 md:py-14">
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Work History
          </motion.p>
          <div>
            {data.experience.map((job, i) => (
              <ExperienceRow key={job.company + job.role} job={job} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
