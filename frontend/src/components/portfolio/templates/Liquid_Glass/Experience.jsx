import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

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

export default function Experience({ data }) {
  return (
    <section className="relative px-6 py-20 text-left">
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <Briefcase size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Experience</h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

          <motion.div variants={stagger} className="space-y-6">
            {(data.experience || []).map((exp, index) => (
              <motion.div key={index} variants={fadeUp} className="md:pl-12 relative">
                {/* Dot */}
                <div className="absolute left-2.5 top-6 w-3 h-3 rounded-full bg-cyan-400 border-2 border-white/20 hidden md:block" />
                <GlassCard className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{exp.role}</h3>
                      <p className="text-cyan-400 text-sm">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-white/50 text-xs whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(exp.techStack || []).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
