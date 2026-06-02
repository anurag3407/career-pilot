import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const Hero = ({ data }) => {
  const { personal, socials } = data;

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <p className="uppercase tracking-[0.4em] text-amber-200 text-sm">
              Academic Scholar
            </p>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-serif leading-tight">
                {personal.name}
              </h1>

              <h2 className="text-2xl md:text-3xl text-stone-300 font-light">
                {personal.title}
              </h2>
            </div>

            <p className="text-stone-400 text-lg leading-relaxed max-w-2xl">
              {personal.bio}
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-5 pt-4">
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-3 border border-stone-700 rounded-full hover:border-amber-200 transition"
              >
                <Github size={20} />
              </a>

              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3 border border-stone-700 rounded-full hover:border-amber-200 transition"
              >
                <Linkedin size={20} />
              </a>

              <a
                href={`mailto:${socials.email}`}
                className="p-3 border border-stone-700 rounded-full hover:border-amber-200 transition"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-amber-200 blur-3xl opacity-20 rounded-full" />

              <img
                src={personal.avatar}
                alt={personal.name}
                className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] object-cover rounded-3xl border border-stone-700 shadow-2xl"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;