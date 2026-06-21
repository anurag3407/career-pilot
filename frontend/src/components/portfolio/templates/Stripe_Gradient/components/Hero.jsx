import { motion } from "framer-motion";
import data from "../../../../../data/dummy_data.json";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-10 overflow-hidden">
      {/* Gradient Blobs */}
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-linear-to-r from-green-500/30 via-sky-500/30 to-indigo-500/30 blur-[140px] rounded-full"
      />

      <motion.div
        animate={{
          x: [0, -60, 60, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-linear-to-r from-rose-500/30 via-pink-500/30 to-purple-500/30 blur-[140px] rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center z-10"
      >
        <img
          src={data.personal.avatar}
          alt={data.personal.name || "Profile Avatar"}
          className="w-32 h-32 rounded-full mx-auto border-4 border-white/20 shadow-2xl"
        />

        <p className="mt-8 text-sky-400 uppercase tracking-[0.3em] text-sm">
          {data.personal.title}
        </p>

        <h1 className="text-5xl md:text-7xl font-bold mt-4 bg-linear-to-r from-white via-green-200 to-purple-300 bg-clip-text text-transparent">
          {data.personal.name}
        </h1>

        <p className="max-w-2xl mx-auto mt-6 text-slate-300 text-lg">
          {data.personal.bio}
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <a
            href="#projects"
            className="px-6 py-3 rounded-full bg-white text-black font-medium flex items-center gap-2"
          >
            View Projects
            <ArrowRight size={18} />
          </a>

          <button className="px-6 py-3 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-2">
            Resume
            <Download size={18} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}