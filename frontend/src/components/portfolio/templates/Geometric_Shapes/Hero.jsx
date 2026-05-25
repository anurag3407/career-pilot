import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Floating Shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-24 left-20 h-28 w-28 rounded-3xl border border-cyan-400/40 bg-cyan-400/10 backdrop-blur-xl"
      />

      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-32 right-24 h-40 w-40 rotate-45 border border-pink-500/30 bg-pink-500/10"
      />

      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-purple-500/20 blur-xl"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl text-center">
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm uppercase tracking-[0.2em] text-cyan-300"
        >
          Geometric Future Design
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black leading-tight"
        >
          Crafting
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            {" "}
            Modern
          </span>
          <br />
          Digital Experiences
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-300"
        >
          A futuristic geometric portfolio experience built with React,
          Tailwind CSS, motion effects, and responsive modern UI principles.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button className="rounded-2xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-black transition hover:scale-105 hover:bg-cyan-400">
            Explore Work
          </button>

          <button className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-white/10">
            Contact Me
          </button>
        </motion.div>
      </div>
    </section>
  );
}