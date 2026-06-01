import React from "react";
import { motion } from "framer-motion";
import { User, MapPin, Star } from "lucide-react";
import data from "../../../../data/dummy_data.json";

export default function About() {
  return (
    <section  className="py-20 px-6  min-h-screen">
      <div className="max-w-6xl mx-auto  bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-3xl p-8 ">

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
                bg-red-500
                flex items-center justify-center
                text-3xl font-bold text-white
                shadow-xl
              "
            >
               01
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white">
            About Me
          </h2>

          <p className="text-slate-400 mt-3">
            Start of the journey
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          whileHover={{
            y: -5,
            scale: 1.01
         }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            bg-[#0B1224]
            border border-slate-700
            rounded-3xl
            p-8 md:p-10
            shadow-2xl
          "
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="
                    w-72 h-72
                    object-cover
                    rounded-3xl
                    border-4 border-red-500
                    shadow-xl
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-4
                    -right-4
                    bg-red-500
                    p-3
                    rounded-2xl
                  "
                >
                  <User className="text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-3xl font-bold text-white">
                {data.personal.name}
              </h3>

              <p className="text-red-400 text-lg mt-2">
                {data.personal.title}
              </p>

              <div className="flex items-center gap-2 mt-4 text-slate-400">
                <MapPin size={18} />
                <span>{data.personal.location}</span>
              </div>

              <p className="mt-6 text-slate-300 leading-relaxed">
                {data.personal.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">

                <div
                  className="
                    bg-[#111827]
                    border border-slate-700
                    rounded-2xl
                    p-4
                    text-center
                  "
                >
                  <h4 className="text-2xl font-bold text-red-400">
                    {data.stats.yearsExperience}+
                  </h4>

                  <p className="text-slate-400 text-sm">
                    Skills Tree
                  </p>
                </div>

                <div
                  className="
                    bg-[#111827]
                    border border-slate-700
                    rounded-2xl
                    p-4
                    text-center
                  "
                >
                  <h4 className="text-2xl font-bold text-yellow-400">
                    {data.stats.projectsCompleted}+
                  </h4>

                  <p className="text-slate-400 text-sm">
                    Quest Log
                  </p>
                </div>

                <div
                  className="
                    bg-[#111827]
                    border border-slate-700
                    rounded-2xl
                    p-4
                    text-center
                  "
                >
                  <h4 className="text-2xl font-bold text-green-400">
                    {data.stats.happyClients}+
                  </h4>

                  <p className="text-slate-400 text-sm">
                     Career Journey
                  </p>
                </div>
                   
              </div>

              {/* Achievement Badge */}
              <div
                className="
                  mt-8
                  inline-flex
                  items-center
                  gap-2
                  bg-red-500/20
                  text-red-400
                  px-4 py-2
                  rounded-full
                "
              >
                <Star size={16} />
                Journey Started
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}