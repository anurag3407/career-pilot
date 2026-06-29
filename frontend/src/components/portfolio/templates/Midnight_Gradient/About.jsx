import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, Mail, Globe, Sparkles } from 'lucide-react';

const GlowingCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className={`relative group rounded-2xl border border-indigo-500/10 hover:border-cyan-400/40 bg-[#0a0d24]/60 backdrop-blur-md hover:shadow-[0_0_35px_rgba(34,211,238,0.12)] transition-all duration-300 ${className}`}
  >
    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-cyan-500/5 group-hover:to-purple-500/5 blur-xl transition-all duration-500" />
    {children}
  </motion.div>
);

export default function About({ data }) {
  return (
    <section className="relative px-6 py-24 bg-[#030514]/40 border-y border-indigo-950/20 text-left">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <User size={20} />
          </div>
          <div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Background</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">About Me</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Detailed Narrative */}
          <GlowingCard className="p-8 lg:col-span-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              My Engineering Philosophy <Sparkles size={16} className="text-cyan-400" />
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6 text-base">
              {data.personal.bio}
            </p>
            <div className="flex items-center gap-2.5 text-gray-400 text-sm">
              <MapPin size={16} className="text-cyan-400" />
              <span>Based in {data.personal.location}</span>
            </div>
          </GlowingCard>

          {/* Quick Profile Meta */}
          <div className="lg:col-span-4 space-y-4">
            {[
              { label: "Current Role", value: data.personal.title, icon: <Briefcase size={16} /> },
              { label: "Work Email", value: data.socials.email, icon: <Mail size={16} /> },
              { label: "Personal Site", value: data.socials.website ?? `https://github.com/${data.personal.name.toLowerCase().replace(" ", "")}`, icon: <Globe size={16} /> },
            ].filter(s => s.value).map(({ label, value, icon }) => (
              <GlowingCard key={label} className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-cyan-400">
                  {icon}
                </div>
                <div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</div>
                  <div className="text-gray-200 text-sm font-medium mt-0.5 truncate max-w-[200px]" title={value}>
                    {value}
                  </div>
                </div>
              </GlowingCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
