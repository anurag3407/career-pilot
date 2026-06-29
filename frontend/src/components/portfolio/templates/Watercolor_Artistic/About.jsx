import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="relative overflow-hidden bg-[#fffaf8] px-6 py-28 text-[#3f3444] md:px-16">
      {/* Massive Watercolor Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-pink-200 blur-3xl" />

        <div className="absolute right-[-8rem] top-16 h-[32rem] w-[32rem] rounded-full bg-sky-200 blur-3xl" />

        <div className="absolute bottom-[-8rem] left-[10%] h-[30rem] w-[30rem] rounded-full bg-purple-200 blur-3xl" />

        <div className="absolute bottom-10 right-[10%] h-80 w-80 rounded-full bg-emerald-200 blur-3xl" />

        <div className="absolute left-[35%] top-[20%] h-72 w-72 rounded-full bg-yellow-200/30 blur-3xl" />

        <div className="absolute right-[30%] bottom-[20%] h-64 w-64 rounded-full bg-orange-200 blur-3xl" />

        <div className="absolute left-[60%] top-[55%] h-72 w-72 rounded-full bg-rose-200 blur-3xl" />
      </div>

      {/* Soft Grain Texture */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-multiply">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.18)_1px,transparent_0)] bg-[size:24px_24px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="relative z-10 mx-auto max-w-7xl"
      >
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* LEFT SECTION */}
          <div>
            {/* Label */}
            <div className="mb-8 inline-flex -rotate-3 rounded-full border border-white/40 bg-white/40 px-7 py-3 shadow-xl backdrop-blur-xl">
              <span className="text-sm uppercase tracking-[0.35em] text-[#8b6d82]">
                About Me
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-3xl text-5xl font-black leading-none md:text-7xl">
              Building modern web experiences.
            </h2>

            {/* Description */}
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#675d68] md:text-xl">
              I’m a frontend developer passionate about creating immersive,
              scalable, and visually engaging web applications.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#675d68]">
              I enjoy building interfaces that feel modern,
              polished, and memorable while maintaining accessibility,
              performance, and maintainable code structure.
            </p>

            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-5">
              <div className="-rotate-2 rounded-2xl border border-white/40 bg-linear-to-br from-pink-100 to-rose-100 px-5 py-3 shadow-xl backdrop-blur-xl">
                ⚛️ React Developer
              </div>

              <div className="rotate-2 rounded-2xl border border-white/40 bg-linear-to-br from-sky-100 to-cyan-100 px-5 py-3 shadow-xl backdrop-blur-xl">
                🎨 UI Engineering
              </div>

              <div className="-rotate-1 rounded-2xl border border-white/40 bg-linear-to-br from-purple-100 to-fuchsia-100 px-5 py-3 shadow-xl backdrop-blur-xl">
                ✨ Motion & Interactions
              </div>

              <div className="rotate-3 rounded-2xl border border-white/40 bg-linear-to-br from-emerald-100 to-lime-100 px-5 py-3 shadow-xl backdrop-blur-xl">
                📱 Responsive Design
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Outer Glow */}
            <div className="absolute inset-0 rounded-[3rem] bg-linear-to-br from-pink-300/40 via-purple-300/40 to-sky-300/40 blur-3xl" />

            {/* Main Card */}
            <div className="relative rotate-3 rounded-[3rem] border border-white/40 bg-white/25 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
              {/* Inner Card */}
              <div className="-rotate-3 rounded-[2.7rem] bg-linear-to-br from-rose-200 via-blue-200 to-green-200 p-10">
                {/* Decorative Gradient Layer */}
                <div className="rounded-4xl border border-white/50 bg-white/20 p-8 backdrop-blur-xl">
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-sky-200 text-6xl shadow-2xl">
                      💻

                      <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-md" />
                    </div>

                    {/* Title */}
                    <h3 className="mt-8 text-4xl font-black">
                      Frontend Developer
                    </h3>

                    {/* Description */}
                    <p className="mt-5 max-w-md leading-relaxed text-gray-900/60">
                      Specialized in crafting responsive interfaces, interactive
                      frontend systems, and modern user experiences with React,
                      Tailwind CSS, animations, and scalable component-based
                      architecture.
                    </p>

                    {/* Skill Pills */}
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                      <span className="rounded-full bg-linear-to-r from-pink-100 to-rose-100 px-5 py-2 text-sm font-medium shadow-lg">
                        React
                      </span>

                      <span className="rounded-full bg-linear-to-r from-sky-100 to-cyan-100 px-5 py-2 text-sm font-medium shadow-lg">
                        Tailwind CSS
                      </span>

                      <span className="rounded-full bg-linear-to-r from-purple-100 to-fuchsia-100 px-5 py-2 text-sm font-medium shadow-lg">
                        JavaScript
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
