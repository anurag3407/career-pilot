import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail, Sparkles } from 'lucide-react';

export default function Hero() {
  const sceneRef = useRef(null);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const springX = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.4 });

  const rotateY = useTransform(springX, [0, 1], [-16, 16]);
  const rotateX = useTransform(springY, [0, 1], [14, -14]);
  const glowX = useTransform(springX, [0, 1], ['20%', '80%']);
  const glowY = useTransform(springY, [0, 1], ['18%', '78%']);
  const spotlight = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(34,211,238,0.18), transparent 28%)`;

  const handlePointerMove = (event) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    pointerX.set(Math.min(1, Math.max(0, x)));
    pointerY.set(Math.min(1, Math.max(0, y)));
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const floatingObjects = [
    { className: 'left-6 top-8 h-28 w-28 border-cyan-400/70', shape: 'diamond', speed: 18, delay: 0 },
    { className: 'right-8 top-24 h-24 w-24 border-fuchsia-400/70', shape: 'cube', speed: 22, delay: 1.2 },
    { className: 'right-20 bottom-20 h-20 w-20 border-amber-300/70', shape: 'ring', speed: 16, delay: 0.5 },
    { className: 'left-10 bottom-16 h-32 w-32 border-violet-400/60', shape: 'triangle', speed: 20, delay: 0.8 },
  ];

  const leftShapes = [
    { className: 'left-8 top-16 h-20 w-20 border-cyan-400/30', shape: 'square', speed: 18, delay: 0.2 },
    { className: 'left-6 top-40 h-24 w-24 border-purple-400/28', shape: 'diamond', speed: 22, delay: 0.6 },
    { className: 'left-12 bottom-28 h-16 w-16 border-amber-300/26', shape: 'ring', speed: 20, delay: 1.0 },
  ];

  return (
    <section
      ref={sceneRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen w-full overflow-hidden bg-[#050816] px-6 py-16 text-white sm:px-8 lg:px-12"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:84px_84px] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,_rgba(5,8,22,0.1)_55%,rgba(5,8,22,0.92)_100%)]" />

      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />

      {/* Left-side subtle geometric reflections */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2" style={{ zIndex: 8 }}>
        {leftShapes.map((s, idx) => (
          <motion.div
            key={idx}
            aria-hidden="true"
            className={`absolute ${s.className} border opacity-80 shadow-[0_0_28px_rgba(0,0,0,0.35)] ${s.shape === 'ring' ? 'rounded-full' : ''} ${s.shape === 'square' ? 'rounded-md bg-white/4' : ''}`}
            style={{ borderWidth: '1.6px' }}
            animate={{
              y: [0, -12, 0],
              rotate: s.shape === 'diamond' ? [0, 8, 0] : [0, 180, 360],
              x: [0, 8, 0],
            }}
            transition={{ duration: s.speed, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            {s.shape === 'diamond' && <div className="absolute inset-3 rotate-45 rounded-[12px] border border-purple-300/40 bg-purple-400/8" />}
            {s.shape === 'square' && <div className="absolute inset-2 rounded-md border border-cyan-300/40" />}
            {s.shape === 'ring' && <div className="absolute inset-3 rounded-full border border-amber-200/40" />}
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.34em] text-cyan-100/90 backdrop-blur-md"
            >
              <Sparkles size={14} className="text-cyan-300" />
              Portfolio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              className="max-w-xl text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span className="block text-white">Hi, I'm</span>
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-300 bg-clip-text text-transparent">Ava Thompson</span>
              <span className="block text-white">Backend Developer</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18 }}
              className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg"
            >
              I build modern, responsive web applications with a focus on performance, accessibility, and polished user experiences — primarily using React, TypeScript and component-driven design.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.26 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="#projects"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(255,255,255,0.12)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Explore Projects
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors duration-200 hover:border-cyan-300/50 hover:bg-cyan-300/10"
              >
                <Download size={16} />
                Download Resume
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.34 }}
              className="mt-10 flex items-center gap-4 text-sm text-slate-400"
            >
              <span className="h-px w-12 bg-gradient-to-r from-cyan-300/60 to-transparent" />
              Minimal. Interactive. Geometric.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.42 }}
              className="mt-12 grid max-w-lg grid-cols-3 gap-3"
            >
              {[
                { value: '5+', label: 'Years Experience' },
                { value: '35+', label: 'Projects Completed' },
                { value: '12+', label: 'Technologies Used' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <div className="text-2xl font-black text-white">{item.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {[
                { icon: <Github size={18} />, label: 'GitHub', href: '#' },
                { icon: <Linkedin size={18} />, label: 'LinkedIn', href: '#' },
                { icon: <Mail size={18} />, label: 'Email', href: '#' },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition-colors duration-200 hover:border-white/10 hover:bg-white/5 hover:text-white"
                >
                  {icon}
                  <span>{label}</span>
                </a>
              ))}
            </motion.div>
          </div>

          <div className="relative flex h-full min-h-[520px] items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.16 }}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative h-[540px] w-[540px] max-w-full"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-10 rounded-full border border-cyan-300/25"
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-20 rounded-full border border-fuchsia-300/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-gradient-to-br from-cyan-400/35 via-sky-500/20 to-fuchsia-500/35 shadow-[0_30px_100px_rgba(34,211,238,0.22)] backdrop-blur-xl"
                style={{ rotate: 12 }}
                animate={{ y: [0, -16, 0], rotate: [12, 16, 12] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md"
                animate={{ scale: [1, 1.08, 1], opacity: [0.9, 0.6, 0.9] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute left-[14%] top-[16%] h-20 w-20 rounded-3xl border border-white/12 bg-white/5 backdrop-blur-md"
                animate={{ x: [0, 10, 0], y: [0, -8, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute bottom-[18%] right-[12%] h-24 w-24 rounded-[28px] border border-fuchsia-300/20 bg-fuchsia-400/15 backdrop-blur-md"
                animate={{ x: [0, -12, 0], y: [0, 8, 0], rotate: [8, -6, 8] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute left-[8%] bottom-[10%] h-28 w-28 rounded-[36px] border border-amber-200/20 bg-amber-300/10 backdrop-blur-md"
                animate={{ y: [0, -12, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="absolute inset-0 rounded-[40px] border border-white/8 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-[2px]" />

              <motion.div
                className="absolute left-1/2 top-1/2 z-[120] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white/10 bg-[rgba(8,12,28,0.82)] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  Profile Summary
                </div>
                <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white">Ava Thompson — Backend Developer</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-300">
                  Dedicated to crafting scalable frontend applications with strong attention to design systems, performance, and user experience. Comfortable shipping components, building design systems, and improving UX across products.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/16">Contact Me</a>
                  <a href="#download" className="inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/4"><Download size={14} />Download CV</a>
                </div>
              </motion.div>
            </motion.div>

            <div className="pointer-events-none absolute inset-0">
              {floatingObjects.map((item) => (
                <motion.div
                  key={item.shape}
                  aria-hidden="true"
                  className={`absolute ${item.className} border opacity-70 shadow-[0_0_40px_rgba(255,255,255,0.05)] ${item.shape === 'cube' ? 'rounded-[24px] bg-white/5' : ''} ${item.shape === 'ring' ? 'rounded-full' : ''}`}
                  style={{ borderWidth: '1.5px', transformStyle: 'preserve-3d' }}
                  animate={{
                    y: [0, -14, 0],
                    rotate: item.shape === 'triangle' ? [0, 8, 0] : [0, 180, 360],
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: item.speed,
                    delay: item.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {item.shape === 'diamond' && (
                    <div className="absolute inset-4 rotate-45 rounded-[18px] border border-cyan-200/30 bg-cyan-400/10" />
                  )}
                  {item.shape === 'cube' && (
                    <>
                      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/10 to-transparent" />
                      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[inherit] border border-white/10" />
                    </>
                  )}
                  {item.shape === 'ring' && <div className="absolute inset-4 rounded-full border border-amber-100/40" />}
                  {item.shape === 'triangle' && (
                    <svg className="absolute inset-4 h-auto w-auto text-violet-300/80" viewBox="0 0 100 100" fill="none">
                      <polygon points="50,8 92,86 8,86" stroke="currentColor" strokeWidth="3" />
                    </svg>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-10 bottom-10 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
