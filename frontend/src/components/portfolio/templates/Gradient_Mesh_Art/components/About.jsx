import React from "react";
import data from "../../../../../data/dummy_data.json";
import { MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="relative py-28 px-6 md:px-20">
      
      {/* background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/5 to-white/0 opacity-40" />

      <div className="max-w-7xl mx-auto relative">

        {/* SECTION TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm mb-6">
            <Sparkles size={16} />
            About Me
          </div>

          <h2 className="text-5xl md:text-6xl font-black">
            A bit more{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 text-transparent bg-clip-text">
              about me
            </span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Blending creativity, engineering, and design thinking to build
            immersive digital experiences.
          </p>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* IMAGE SIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            {/* glow behind image */}
            <div className="absolute w-[420px] h-[420px] bg-gradient-to-r from-pink-500/30 to-cyan-400/30 blur-3xl rounded-full" />

            <div className="relative">
              <div className="absolute inset-0 bg-white/10 blur-2xl rounded-[2.5rem]" />

              <img
                src={data.personal.avatar}
                alt="avatar"
                className="relative w-[340px] md:w-[420px] rounded-[2.5rem] border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>

          {/* TEXT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: "Years", value: data.stats.yearsExperience },
                { label: "Projects", value: data.stats.projectsCompleted },
                { label: "Clients", value: data.stats.happyClients },
              ].map((item, i) => (
                <div
                  key={i}
                  className="
                    bg-linear-to-br from-violet-800/20 to-rose-800/20
                    border border-white/10 
                    rounded-2xl 
                    p-5 
                    text-center 
                    hover:bg-white/10 
                    hover:-translate-y-1 
                    transition-all
                  "
                >
                  <h3 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-cyan-300 text-transparent bg-clip-text">
                    {item.value}+
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">{item.label}</p>
                </div>
              ))}
            </div>

            {/* BIO */}
            <div className="bg-linear-to-br from-sky-600/20 to-pink-600/20 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <p className="text-gray-300 leading-relaxed text-lg">
                {data.personal.bio}
              </p>

              {/* location */}
              <div className="flex items-center gap-2 mt-6 text-gray-400">
                <MapPin size={18} className="text-cyan-300" />
                {data.personal.location}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}