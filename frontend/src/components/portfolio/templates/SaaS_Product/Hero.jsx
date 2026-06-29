import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Download, Sparkles } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

function bioTeaser(bio = '') {
  if (bio.length <= 120) {
    return bio;
  }

  return `${bio.slice(0, 120).trim()}...`;
}

export default function Hero({ data }) {
  const proofAvatars = (data.testimonials || []).slice(0, 3).map((testimonial) => testimonial?.avatar);
  const fallbackAvatar = data.personal?.avatar;

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pb-20 pt-32"
      style={{
        backgroundImage:
          'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    >
      <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#6366F1]/[0.12] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-[#8B5CF6]/[0.08] blur-3xl" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.9fr]"
      >
        <div className="max-w-4xl">
          <motion.div
            variants={item}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-2 text-sm font-medium text-indigo-300"
          >
            <Sparkles size={16} strokeWidth={1.7} />
            Open to Opportunities
          </motion.div>

          <motion.h1
            variants={item}
            className="saas-heading-gradient text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl"
          >
            {data.personal?.name}
          </motion.h1>

          <motion.p variants={item} className="mt-7 max-w-3xl text-xl font-light text-[#8884A8] md:text-2xl">
            {data.personal?.title}
          </motion.p>

          <motion.p variants={item} className="mt-5 max-w-xl text-base leading-relaxed text-[#4B4870]">
            {bioTeaser(data.personal?.bio)}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-300 hover:scale-[1.02] hover:brightness-110"
            >
              View My Work
              <ArrowRight size={18} strokeWidth={1.8} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-[#8884A8] transition duration-300 hover:border-white/40 hover:text-white"
            >
              Download CV
              <Download size={18} strokeWidth={1.8} />
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <div className="flex pl-2">
              {(proofAvatars.length ? proofAvatars : [fallbackAvatar, fallbackAvatar, fallbackAvatar]).map(
                (avatar, index) =>
                  avatar ? (
                    <img
                      key={`${avatar}-${index}`}
                      src={avatar}
                      alt={`Client proof ${index + 1}`}
                      className="-ml-2 h-9 w-9 rounded-full border-2 border-[#0D0D12] object-cover"
                    />
                  ) : null,
              )}
            </div>
            <p className="text-sm text-[#4B4870]">Trusted by {data.stats?.happyClients}+ clients</p>
          </motion.div>
        </div>

        <motion.div variants={item} className="relative hidden lg:block">
          <div className="absolute inset-0 rounded-[2rem] bg-[#6366F1]/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#13131A]/80 p-4 shadow-2xl shadow-indigo-950/40">
            <div className="rounded-3xl border border-white/8 bg-[#0D0D12] p-4">
              {data.personal?.avatar ? (
                <img
                  src={data.personal.avatar}
                  alt={data.personal?.name || 'Portfolio avatar'}
                  className="h-[28rem] w-full rounded-2xl object-cover"
                />
              ) : null}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/8 bg-[#1A1A24] p-4">
                  <p className="text-2xl font-bold text-white">{data.stats?.yearsExperience}+</p>
                  <p className="mt-1 text-xs text-[#8884A8]">Years</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[#1A1A24] p-4">
                  <p className="text-2xl font-bold text-white">{data.stats?.projectsCompleted}+</p>
                  <p className="mt-1 text-xs text-[#8884A8]">Ships</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[#1A1A24] p-4">
                  <p className="text-2xl font-bold text-white">{data.skills?.length || 0}</p>
                  <p className="mt-1 text-xs text-[#8884A8]">Skills</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[#6366F1] md:flex">
        <div className="relative h-14 w-px bg-[#6366F1]/20">
          <motion.span
            animate={{ y: [0, 36, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#6366F1]"
          />
        </div>
        <ArrowDown size={16} strokeWidth={1.8} />
      </div>
    </section>
  );
}
