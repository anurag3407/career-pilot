import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, MapPin, Sparkles } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

function shortBio(bio = '') {
  const text = typeof bio === 'string' ? bio : '';
  if (text.length <= 145) return text;
  return `${text.slice(0, 145).trim()}...`;
}

export default function Hero({ data }) {
  const stats = [
    { value: data.stats?.yearsExperience ?? 0, label: 'Years' },
    { value: data.stats?.projectsCompleted ?? 0, label: 'Projects' },
    { value: data.stats?.happyClients ?? 0, label: 'Clients' },
  ];

  return (
    <section className="relative min-h-screen px-5 py-8 md:px-8">
      <div className="absolute inset-0 scandi-wood opacity-60" />
      <div className="absolute left-[-8rem] top-24 h-80 w-80 rounded-full bg-[#DDE9EB]/80 blur-3xl" />
      <div className="absolute bottom-16 right-[-8rem] h-96 w-96 rounded-full bg-[#EBCDB8]/70 blur-3xl" />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#E7DED1] bg-[#FFFDF8]/80 px-4 py-3 shadow-[0_18px_60px_rgba(70,56,39,0.08)] backdrop-blur-md">
        <a href="#top" className="text-sm font-semibold tracking-tight text-[#283028]">
          {data.personal?.name}
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full bg-[#315343] px-4 py-2 text-xs font-semibold text-[#FFFDF8] transition hover:bg-[#283028]"
        >
          Contact
          <ArrowUpRight size={14} />
        </a>
      </nav>

      <motion.div
        id="top"
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div>
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D9C3A8] bg-[#FFFDF8]/70 px-4 py-2 text-sm font-medium text-[#315343]"
          >
            <Sparkles size={16} />
            Thoughtful digital craft
          </motion.div>

          <motion.h1
            variants={item}
            className="scandi-serif max-w-4xl text-5xl font-semibold leading-[1.03] tracking-[-0.01em] text-[#283028] md:text-7xl"
          >
            {data.personal?.name}
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-2xl text-xl leading-relaxed text-[#526053] md:text-2xl">
            {data.personal?.title}
          </motion.p>

          <motion.p variants={item} className="mt-5 max-w-2xl text-base leading-8 text-[#6F746B]">
            {shortBio(data.personal?.bio)}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#315343] px-6 py-3 text-sm font-semibold text-[#FFFDF8] shadow-[0_18px_45px_rgba(49,83,67,0.25)] transition hover:-translate-y-0.5 hover:bg-[#283028]"
            >
              View projects
              <ArrowUpRight size={17} />
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-full border border-[#D9C3A8] bg-[#FFFDF8]/75 px-6 py-3 text-sm font-semibold text-[#526053] transition hover:-translate-y-0.5 hover:border-[#8FA58A] hover:text-[#283028]"
            >
              About the work
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex items-center gap-3 text-sm text-[#6F746B]">
            <MapPin size={17} className="text-[#C58A63]" />
            {data.personal?.location}
          </motion.div>
        </div>

        <motion.div variants={item} className="relative mx-auto w-full max-w-md">
          <div className="absolute -right-5 -top-5 h-full w-full rounded-[2rem] bg-[#DDE9EB]" />
          <div className="absolute -bottom-5 -left-5 h-full w-full rounded-[2rem] bg-[#EBCDB8]" />
          <div className="relative rounded-[2rem] border border-[#E7DED1] bg-[#FFFDF8] p-4 shadow-[0_28px_90px_rgba(70,56,39,0.16)]">
            {data.personal?.avatar ? (
              <img
                src={data.personal.avatar}
                alt={data.personal?.name || 'Portfolio portrait'}
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
              />
            ) : null}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-[#F7F3EA] p-4 text-center">
                  <p className="scandi-serif text-2xl font-semibold text-[#315343]">{stat.value}+</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[#8B7D6B]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#8B7D6B] md:flex">
        Scroll
        <ArrowDown size={16} />
      </div>
    </section>
  );
}
