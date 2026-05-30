import React from "react";
import { motion } from "framer-motion";
import { User, MapPin, Mail, Github, Globe } from "lucide-react";

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${className}`}
  >
    {children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function About({ data }) {
  return (
    <section className="relative px-6 py-20 text-left">
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-purple-500/20 blur-[100px]" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <User size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">About Me</h2>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-white/70 leading-relaxed text-base mb-4">{data.personal.bio}</p>
                <p className="text-white/50 text-sm flex items-center gap-2">
                  <MapPin size={14} className="text-cyan-400" />
                  {data.personal.location}
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Email", value: data.socials.email, icon: <Mail size={14} /> },
                  { label: "GitHub", value: data.socials.github, icon: <Github size={14} /> },
                  { label: "Website", value: data.socials.website, icon: <Globe size={14} /> },
                ].filter(s => s.value).map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-cyan-400">{icon}</span>
                    <div>
                      <div className="text-white/40 text-xs">{label}</div>
                      <div className="text-white/80 text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
