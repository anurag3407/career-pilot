import React from "react";
import data from "../../../../../data/dummy_data.json";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function Experience() {
  return (
    <section className="relative py-28 px-6 md:px-20">
      
      {/* soft background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-40" />

      <div className="max-w-5xl mx-auto relative">

        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm mb-6">
            <Briefcase size={16} />
            Experience
          </div>

          <h2 className="text-5xl md:text-6xl font-black">
            My{" "}
            <span className="bg-linear-to-r from-pink-400 via-purple-400 to-cyan-300 text-transparent bg-clip-text">
              journey
            </span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            A timeline of roles, responsibilities, and impact across projects
            and collaborations.
          </p>
        </motion.div>

        {/* TIMELINE */}
        <div className="relative border-l border-white/10 pl-8 space-y-10">

          {data.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >

              {/* timeline dot */}
              <div className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 shadow-lg shadow-pink-500/30" />

              {/* card */}
              <div
                className="
                  bg-white/5 
                  border border-white/10 
                  backdrop-blur-xl 
                  rounded-3xl 
                  p-7 
                  hover:bg-white/10 
                  hover:-translate-y-1 
                  transition-all duration-300
                "
              >
                {/* top row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">

                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {exp.role}
                    </h3>

                    <p className="text-purple-300 font-medium">
                      {exp.company}
                    </p>
                  </div>

                  <span className="text-sm text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    {exp.period}
                  </span>
                </div>

                {/* description */}
                <p className="text-gray-300 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}