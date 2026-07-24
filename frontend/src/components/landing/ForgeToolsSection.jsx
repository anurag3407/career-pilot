import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../../data/featuresConfig';
import '../../styles/forge.css';
import StatusBadge from '../forge/StatusBadge';
import ForgeButton from '../forge/ForgeButton';

const ICON_PATHS = {
  FileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
  Palette: 'M12 2a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z M7.5 11.5A1 1 0 1 0 7 13a1 1 0 0 0 .5-1.5z M12 7.5A1 1 0 1 0 12.5 9 1 1 0 0 0 12 7.5z',
  Flame: 'M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-3-2 1-4 3-4 6a7 7 0 0 0 14 0c0-5-7-11-7-11z',
  Github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  Network: 'M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M5 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M19 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M7 18l3-7 M17 18l-3-7 M8 19h8',
  Mic: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8',
  Users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  Briefcase: 'M2 7h20v13H2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
};

const header = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function ForgeToolsSection() {
  return (
    <section className="forge-page" style={{ padding: '84px 0' }}>
      <div className="forge-container">
        <motion.div
          variants={header}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          style={{ textAlign: 'center' }}
        >
          <motion.div variants={item} style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <StatusBadge label="ALL SYSTEMS OPERATIONAL" />
          </motion.div>
          <motion.h2 variants={item} className="forge-h2">
            Powerful AI tools for <span style={{ color: 'var(--forge-accent)' }}>every step</span>
          </motion.h2>
          <motion.p variants={item} className="forge-sub">
            From your first resume draft to your final interview, CareerPilot gives you the unfair advantage you need.
          </motion.p>
        </motion.div>

        <div className="forge-tools-grid" style={{ marginTop: 44 }}>
          {FEATURES.map((f, i) => {
            const Icon = (p) => (
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
                {(ICON_PATHS[f.icon?.name] || ICON_PATHS.FileText).split(' M').map((seg, k) => (
                  <path key={k} d={k === 0 ? seg : 'M' + seg} />
                ))}
              </svg>
            );
            const large = f.size === 'large';
            return (
              <motion.div
                key={f.slug}
                variants={item}
                className={`forge-tool ${large ? 'lg' : ''}`}
                style={large ? { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } : {}}
              >
                <div className="ico"><Icon /></div>
                <div>
                  <span className="badge-tag">{f.badge || 'Tool'}</span>
                  <h3>{f.name}</h3>
                  <p>{f.tagline}</p>
                </div>
                <div style={{ marginTop: 18 }}>
                  <ForgeButton to={f.primaryAction.to} variant="ghost">{f.primaryAction.label} →</ForgeButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
