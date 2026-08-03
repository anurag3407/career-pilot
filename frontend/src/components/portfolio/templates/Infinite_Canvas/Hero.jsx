import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin, Briefcase, FolderKanban, Users } from "lucide-react";

export default function Hero({ data }) {
  const { personal = {}, stats = {} } = data || {};

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <img
            src={
              personal.avatar ||
              "https://placehold.co/400x400?text=Avatar"
            }
            alt={personal.name || "Profile"}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-cyan-500/30 mx-auto shadow-[0_0_60px_rgba(6,182,212,0.25)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
              {personal.name || "Portfolio Owner"}
            </span>
          </h1>

          <p className="text-xl md:text-3xl text-gray-300 mb-6">
            {personal.title || "Professional"}
          </p>

          <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-8">
            {personal.tagline ||
              "Building exceptional digital experiences and solving complex problems through thoughtful design and engineering."}
          </p>

          {personal.location && (
            <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
              <MapPin size={18} />
              <span>{personal.location}</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <Briefcase
              className="mx-auto text-cyan-400 mb-3"
              size={24}
            />
            <h3 className="text-4xl font-bold">
              {stats.yearsExperience ?? 0}
            </h3>
            <p className="text-gray-400 mt-2">
              Years Experience
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <FolderKanban
              className="mx-auto text-purple-400 mb-3"
              size={24}
            />
            <h3 className="text-4xl font-bold">
              {stats.projectsCompleted ?? 0}
            </h3>
            <p className="text-gray-400 mt-2">
              Projects Completed
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <Users
              className="mx-auto text-emerald-400 mb-3"
              size={24}
            />
            <h3 className="text-4xl font-bold">
              {stats.happyClients ?? 0}
            </h3>
            <p className="text-gray-400 mt-2">
              Happy Clients
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mt-16 flex flex-col items-center text-gray-500"
        >
          <span className="text-sm uppercase tracking-[0.3em] mb-2">
            Explore Canvas
          </span>
          <ChevronDown size={22} />
        </motion.div>
      </div>
    </section>
  );
}