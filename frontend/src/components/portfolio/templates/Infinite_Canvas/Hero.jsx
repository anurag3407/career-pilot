import React from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, FolderKanban, Users } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function Hero({ data }) {
  const { personal, stats } = data;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] md:w-[650px] z-20">
      <CanvasCard delay={0.1}>
        <div className="flex flex-col items-center text-center">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            src={personal.avatar}
            alt={personal.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-cyan-400/30 mb-6"
          />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
              {personal.name}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-300 mt-3"
          >
            {personal.title}
          </motion.p>

          {personal.tagline && (
            <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
              {personal.tagline}
            </p>
          )}

          <div className="flex items-center gap-2 mt-5 text-gray-400 text-sm">
            <MapPin size={16} />
            <span>{personal.location}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Briefcase className="mx-auto mb-2 text-cyan-400" size={22} />
              <p className="text-3xl font-bold">
                {stats?.yearsExperience ?? 0}
              </p>
              <p className="text-sm text-gray-400">Years Experience</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <FolderKanban
                className="mx-auto mb-2 text-purple-400"
                size={22}
              />
              <p className="text-3xl font-bold">
                {stats?.projectsCompleted ?? 0}
              </p>
              <p className="text-sm text-gray-400">Projects</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Users className="mx-auto mb-2 text-emerald-400" size={22} />
              <p className="text-3xl font-bold">
                {stats?.happyClients ?? 0}
              </p>
              <p className="text-sm text-gray-400">Happy Clients</p>
            </div>
          </div>
        </div>
      </CanvasCard>
    </div>
  );
}