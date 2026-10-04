import React from "react";
import data from "../../../../../data/dummy_data.json";
import { motion } from "framer-motion";

export default function Testimonials() {
  // duplicate array for seamless loop
  const looped = [...data.testimonials, ...data.testimonials];

  return (
    <section className="relative py-28 overflow-hidden">

      {/* TITLE */}
      <div className="text-center mb-16 px-6">
        <h2 className="text-5xl font-black">
          What people{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 text-transparent bg-clip-text">
            say
          </span>
        </h2>
        <p className="text-gray-400 mt-4">
          Real feedback from collaborations and projects
        </p>
      </div>

      {/* EDGE GRADIENT OVERLAYS */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-[#050712] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-[#050712] to-transparent z-10" />

      {/* SCROLLING TRACK */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear",
          }}
        >

          {looped.map((t, i) => (
            <div
              key={i}
              className="
              w-150
                bg-white/5 
                border border-white/10 
                backdrop-blur-xl 
                rounded-3xl 
                p-6 
                hover:bg-white/10 
                hover:-translate-y-2 
                hover:scale-[1.02]
                transition-all duration-300
                shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]
              "
            >
              {/* stars */}
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
              </div>

              {/* text */}
              <p className="text-gray-300 italic leading-relaxed">
                “{t.text}”
              </p>

              {/* user */}
              <div className="mt-6 flex items-center gap-4">
                <img
                  src={t.avatar}
                  className="w-12 h-12 rounded-full border border-white/10"
                 alt={t.name ? `${t.name} profile photo` : "Profile avatar"}/>

                <div>
                  <h4 className="font-semibold text-white">{t.name}</h4>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}

        </motion.div>
      </div>
    </section>
  );
}