import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import data from "../../../../data/dummy_data.json";

export default function Skills() {
  return (
    <section 
     id="board-skills"
    className=" relative overflow-hidden py-20 px-6">
      <div className="max-w-6xl mx-auto">

             {/* Floating Board Tiles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

   {[...Array(20)].map((_, i) => (
    <motion.div
      key={i}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 6 + i,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute rounded-3xl opacity-10  blur-sm"
      style={{
        width: "70px",
        height: "70px",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: [
          "#ef4444",
          "#eab308",
          "#3b82f6",
          "#22c55e",
          "#a855f7",
        ][i % 5],
      }}
    />
  ))}

</div>
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div
              className="
                w-20 h-20
                rounded-2xl
                bg-yellow-500
                flex items-center justify-center
                text-3xl font-bold text-black
                shadow-xl
              "
            >
              02
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white">
            Skills & Power-Ups
          </h2>

          <p className="text-slate-400 mt-3">
            Skills collected throughout my development journey
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {data.skills?.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
              }}
              className="
                bg-[#0B1224]
                border border-slate-700
                rounded-3xl
                p-6
                shadow-xl
                hover:border-yellow-500
                transition-all
              "
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {skill.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {skill.category}
                  </p>
                </div>

                <Trophy
                  size={22}
                  className="text-yellow-400"
                />
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${skill.level}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                  }}
                  className="
                    h-full
                    bg-yellow-500
                    rounded-full
                  "
                />
              </div>

              {/* Percentage */}
              <div className="mt-3 text-right text-yellow-400 font-semibold">
                {skill.level}%
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}