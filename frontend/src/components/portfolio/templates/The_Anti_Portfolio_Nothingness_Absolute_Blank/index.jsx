import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../../../hooks/usePortfolio';
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';

/**
 * The Anti-Portfolio: Nothingness Absolute Blank
 * Theme: "The best portfolio is no portfolio."
 * Inspiration: Swiss minimalism, Brutalist whitespace, premium editorial layouts.
 */
export default function TheAntiPortfolio() {
  const { data } = usePortfolio();
  const { personal, socials, skills, projects, experience, education } = data;

  const projectCount = projects?.length || 0;
  const skillCount = skills?.length || 0;
  
  // Calculate total years of experience
  const yearsExp = data.stats?.yearsExperience || 
    (experience?.length ? experience.length * 2 : 5);

  // Get primary education string
  const primaryEdu = education?.length > 0
    ? `${education[0].degree || 'Degree'} • ${education[0].school || education[0].location || 'University'}`
    : 'B.Tech • Pune';

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-[#111] dark:text-[#eee] selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-500 font-serif flex flex-col justify-between p-6 sm:p-12 md:p-24 relative overflow-hidden">
      {/* Subtle grid pattern background for editorial feel */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#000 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

      {/* Top Header Row */}
      <motion.header 
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
        className="w-full flex justify-between items-baseline border-b border-neutral-200 dark:border-neutral-800 pb-4 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400"
      >
        <span>THE ANTI-PORTFOLIO / BLANK</span>
        <span>EST. {new Date().getFullYear()}</span>
      </motion.header>

      {/* Main Container - Editorial Whitespace */}
      <main className="flex-1 my-32 sm:my-48 max-w-4xl mx-auto w-full flex flex-col justify-center">
        {/* Hero Title Section */}
        <div className="space-y-8 mb-24 sm:mb-36">
          <motion.p
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-neutral-400 dark:text-neutral-500"
          >
            {personal.title || 'Creative Technologist'}
          </motion.p>
          <motion.h1 
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-6xl sm:text-8xl md:text-[9.5rem] font-light leading-none tracking-tighter uppercase"
          >
            {personal.name || 'Anonymous'}
          </motion.h1>
          <motion.p 
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="text-xl sm:text-2xl italic font-light text-neutral-400 dark:text-neutral-500 max-w-xl"
          >
            "Nothing to prove."
          </motion.p>
        </div>

        {/* Thin Elegant Divider */}
        <motion.div 
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
          className="h-px bg-neutral-200 dark:bg-neutral-800 w-full mb-24" 
        />

        {/* Stark Anti-Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-24 text-left">
          
          {/* Projects Anti-Section */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeUp}
            className="space-y-4"
          >
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">I. PROJECTS</h2>
            <p className="text-2xl sm:text-3xl font-light text-neutral-800 dark:text-neutral-200">
              Work speaks for itself.
            </p>
            {projectCount > 0 && (
              <p className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
                ({projectCount} projects intentionally omitted)
              </p>
            )}
          </motion.section>

          {/* Experience Anti-Section */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={2}
            variants={fadeUp}
            className="space-y-4"
          >
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">II. EXPERIENCE</h2>
            <p className="text-2xl sm:text-3xl font-light text-neutral-800 dark:text-neutral-200">
              Experience exists.
            </p>
            <p className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
              ({yearsExp} years quietly accumulated)
            </p>
          </motion.section>

          {/* Skills Anti-Section */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={3}
            variants={fadeUp}
            className="space-y-4"
          >
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">III. SKILLS</h2>
            <p className="text-2xl sm:text-3xl font-light text-neutral-800 dark:text-neutral-200">
              Skills not listed.
            </p>
            {skillCount > 0 && (
              <p className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
                ({skillCount} skills withheld)
              </p>
            )}
          </motion.section>

          {/* Education Anti-Section */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={4}
            variants={fadeUp}
            className="space-y-4"
          >
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">IV. EDUCATION</h2>
            <p className="text-2xl sm:text-3xl font-light text-neutral-800 dark:text-neutral-200">
              Educated.
            </p>
            <p className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
              ({primaryEdu})
            </p>
          </motion.section>

        </div>
      </main>

      {/* Footer & Clean Contact Section */}
      <motion.footer 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
        className="w-full border-t border-neutral-200 dark:border-neutral-800 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 font-mono text-xs tracking-wider"
      >
        {/* Functional Contact Links */}
        <div className="flex flex-wrap gap-8 justify-center">
          {socials.email && (
            <a 
              href={`mailto:${socials.email}`} 
              className="flex items-center gap-1.5 hover:text-neutral-400 transition-colors py-1 group text-neutral-500 dark:text-neutral-400"
            >
              <Mail size={12} />
              <span>EMAIL</span>
              <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
          {socials.github && (
            <a 
              href={socials.github} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-neutral-400 transition-colors py-1 group text-neutral-500 dark:text-neutral-400"
            >
              <Github size={12} />
              <span>GITHUB</span>
              <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
          {socials.linkedin && (
            <a 
              href={socials.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-neutral-400 transition-colors py-1 group text-neutral-500 dark:text-neutral-400"
            >
              <Linkedin size={12} />
              <span>LINKEDIN</span>
              <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
        </div>

        {/* Minimal Copyright */}
        <span className="text-neutral-400 dark:text-neutral-500 text-[10px] tracking-[0.15em] uppercase">
          © {personal.name || 'ANONYMOUS'} {new Date().getFullYear()}
        </span>
      </motion.footer>
    </div>
  );
}
