import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import data from "../../../../data/dummy_data.json";

export default function Experience() {
  return (
    <section 
      id="board-experience"
    className="py-20 px-6">
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
      className="absolute rounded-3xl opacity-10 blur-sm"
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
                bg-green-500
                flex items-center justify-center
                text-3xl font-bold text-white
                shadow-xl
              "
            >
              04
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white">
            Experience
          </h2>

          <p className="text-slate-400 mt-3">
            My professional journey and achievements
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Vertical Line */}
          <div
            className="
              absolute
              left-5
              top-0
              bottom-0
              w-1
              bg-green-500/40
            "
          />

          <div className="space-y-10">
            {data.experience?.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="relative pl-16"
              >
                {/* Timeline Dot */}
                <div
                  className="
                    absolute
                    left-0
                    top-6
                    w-10
                    h-10
                    rounded-full
                    bg-green-500
                    flex
                    items-center
                    justify-center
                    shadow-lg
                  "
                >
                  <Briefcase
                    size={18}
                    className="text-white"
                  />
                </div>

                {/* Experience Card */}
                <div
                  className="
                    bg-[#0B1224]
                    border border-slate-700
                    rounded-3xl
                    p-6
                    shadow-xl
                    hover:border-green-500
                    transition-all
                  "
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-bold text-white">
                      {exp.role}
                    </h3>

                    <span
                      className="
                        text-sm
                        bg-green-500/20
                        text-green-400
                        px-3
                        py-1
                        rounded-full
                      "
                    >
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-green-400 font-medium mt-2">
                    {exp.company}
                  </p>

                  <p className="text-slate-300 mt-4 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}