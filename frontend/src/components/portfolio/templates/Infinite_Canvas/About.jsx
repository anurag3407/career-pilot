import React from "react";
import { motion } from "framer-motion";
import { MapPin, User, Sparkles } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function About({ data }) {
  const { personal = {}, stats = {} } = data || {};

  return (
    <CanvasCard delay={0.1}>
      <div className="flex items-center gap-3 mb-6">
        <User className="text-cyan-400" size={22} />
        <h2 className="text-3xl font-bold">About Me</h2>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-5"
        >
          <img
            src={
              personal.avatar ||
              "https://placehold.co/400x400?text=Profile"
            }
            alt={personal.name || "Profile"}
            className="w-24 h-24 rounded-2xl object-cover border border-white/10"
          />

          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold">
              {personal.name || "Portfolio Owner"}
            </h3>

            <p className="text-cyan-300 mt-1">
              {personal.title || "Professional"}
            </p>

            {personal.location && (
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-gray-400">
                <MapPin size={15} />
                <span>{personal.location}</span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-300 leading-8"
        >
          {personal.bio ||
            "Passionate professional focused on building impactful digital products and meaningful user experiences."}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-cyan-400" />
              <h4 className="font-semibold">Experience</h4>
            </div>

            <p className="text-3xl font-bold">
              {stats.yearsExperience ?? 0}
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Years of industry experience
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-purple-400" />
              <h4 className="font-semibold">Projects</h4>
            </div>

            <p className="text-3xl font-bold">
              {stats.projectsCompleted ?? 0}
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Successful projects delivered
            </p>
          </div>
        </div>
      </div>
    </CanvasCard>
  );
}