import React from "react";
import data from "../../../../../data/dummy_data.json";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-6 sm:px-10 lg:px-20 py-24 overflow-hidden">

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* ================= TEXT CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="z-10 order-2 lg:order-1 text-center lg:text-left"
        >

          {/* MAIN HEADING */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight">

            I build{" "}

            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 text-transparent bg-clip-text">
              digital experiences
            </span>
          </h1>

          {/* SUBTITLE */}
          <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 mt-6">
            {data.personal.name} — {data.personal.title}
          </h2>

          {/* BIO */}
          <p className="text-gray-400 mt-6 max-w-xl mx-auto lg:mx-0 leading-relaxed text-sm sm:text-base md:text-lg">
            {data.personal.bio}
          </p>

          {/* BUTTONS */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-10">

            <button
              className="
                px-7 py-4 rounded-2xl 
                bg-linear-to-r from-pink-500 to-cyan-400
                font-semibold
                hover:scale-105
                transition-all duration-300
                shadow-md shadow-cyan-500/20
              "
              onClick={() => {
                const projectsSection = document.getElementById("projects");
                projectsSection.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Projects
            </button>

            <button
              className="
                px-7 py-4 rounded-2xl
                bg-white/5
                border border-white/10
                backdrop-blur-xl
                hover:bg-white/10
                transition-all duration-300
              "
              onClick={() => {
                const contactSection = document.getElementById("contact");
                contactSection.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact Me
            </button>
          </div>
        </motion.div>

        {/* ================= IMAGE SECTION ================= */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center order-1 lg:order-2"
        >

          {/* OUTER GLOW */}
          <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] bg-gradient-to-r from-pink-500/30 via-purple-500/20 to-cyan-400/30 blur-3xl rounded-full animate-pulse" />

          {/* SECONDARY RING */}
          <div className="absolute w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] md:w-[460px] md:h-[460px] border border-white/10 rounded-full" />

          {/* IMAGE WRAPPER */}
          <div className="relative">

            {/* INNER BLUR */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-cyan-400/20 blur-2xl rounded-full" />

            {/* IMAGE */}
            <img
              src={data.personal.avatar}
              alt={data.personal.name}
              className="
                relative
                w-[240px]
                sm:w-[320px]
                md:w-[420px]
                lg:w-[460px]
                aspect-square
                object-cover
                rounded-full
                border border-white/10
                shadow-2xl
                hover:scale-[1.03]
                transition-transform duration-500
              "
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
