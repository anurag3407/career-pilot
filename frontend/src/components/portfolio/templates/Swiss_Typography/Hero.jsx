import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';

const ACCENT = '#E63946';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Label({ children }) {
  return (
    <span className="text-[10px] md:text-xs font-black tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

export default function Hero({ data }) {
  const { name, title, location } = data.personal;
  const { github, linkedin, twitter, email } = data.socials;
  const { yearsExperience, projectsCompleted, happyClients } = data.stats;

  const stats = [
    { value: `${yearsExperience}+`, label: 'Years' },
    { value: `${projectsCompleted}+`, label: 'Projects' },
    { value: `${happyClients}+`, label: 'Clients' },
  ];

  const socialLinks = [
    { href: github, Icon: Github, label: 'GitHub' },
    { href: linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: twitter, Icon: Twitter, label: 'Twitter' },
    { href: `mailto:${email}`, Icon: Mail, label: 'Email' },
  ];

  return (
    <section className="border-b border-black text-left">
      {/* top nav bar */}
      <div className="flex items-center justify-between px-5 md:px-12 py-3 border-b border-black">
        <Label>Portfolio — Swiss Typography</Label>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold tracking-widest uppercase">
          <MapPin size={10} />
          {location}
        </div>
      </div>

      {/* hero grid */}
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* large name */}
        <div className="md:col-span-8 px-5 md:px-12 py-10 md:py-20 border-b md:border-b-0 md:border-r border-black">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-3">
            <Label>01 — Introduction</Label>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="font-black leading-[0.88] tracking-tight text-black uppercase"
            style={{ fontSize: 'clamp(2.6rem, 9vw, 7.5rem)' }}
          >
            {name.split(' ').map((word, i) => (
              <span key={i} className="block">
                {word}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-5 flex items-center gap-3"
          >
            <div className="w-8 h-px bg-black" />
            <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-[0.18em]">
              {title}
            </p>
          </motion.div>
        </div>

        {/* right sidebar: stats + socials */}
        <div className="md:col-span-4 flex flex-col">
          <div className="grid grid-cols-3 md:grid-cols-1 divide-x md:divide-x-0 md:divide-y divide-black border-b border-black md:border-b-0">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial="hidden"
                animate="visible"
                custom={i + 2}
                variants={fadeUp}
                className="px-5 md:px-8 py-5 md:py-8"
              >
                <div className="text-2xl md:text-4xl font-black leading-none" style={{ color: ACCENT }}>
                  {value}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* social row */}
          <div className="border-t border-black px-5 md:px-8 py-5 flex gap-3 mt-auto">
            {socialLinks.map(({ href, Icon, label }, i) => (
              href && (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  initial="hidden"
                  animate="visible"
                  custom={i + 5}
                  variants={fadeUp}
                  className="w-8 h-8 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
                >
                  <Icon size={13} />
                </motion.a>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
