import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dice6, Play } from "lucide-react";
import data from "../../../../data/dummy_data.json";

export default function Hero() {
    const [rolling, setRolling] = useState(false);
    const startJourney = () => {
       setRolling(true);
       setTimeout(() => {
       document
            .getElementById("board-about")
             ?.scrollIntoView({
             behavior: "smooth",
             block: "start",
           });
    setRolling(false);
    }, 1200);
    };
  const scrollToSection = (sectionId) => {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  return (
    <section className="relative min-h-screen bg-[#081528] overflow-hidden ">

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
      className="absolute rounded-3xl opacity-10 blur-sm "
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

        {/* Colored Glow Effects */}
<div className="absolute top-40 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />

<div className="absolute top-20 right-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl" />

<div className="absolute bottom-40 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

<div className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

<div className="absolute bottom-32 left-1/2 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Floating Dice */}
      <motion.div
        animate={
          rolling
             ? {
                 rotate: [0, 720, 1440],
                scale: [1, 1.3, 1],
               }
             : {
                rotate: [0, 360],
                y: [0, -20, 0],
               }
        }
      transition={{
           repeat: rolling ? 0 : Infinity,
          duration: rolling ? 1.2 : 6,
       }}
        className="absolute top-12 right-12"
      >
        <Dice6 size={60} className="text-yellow-400" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen flex flex-col items-center justify-center">

        {/* Heading */}
        <div className="text-center">

          <span className="text-yellow-400 tracking-[0.3em] font-bold">
            BOARD GAME PORTFOLIO
          </span>

          <h1 className="text-5xl  sm:text-6xl md:text-8xl font-black text-white mt-6">
            {data.personal.name}
          </h1>

          <p className="text-2xl text-slate-300 mt-4">
            {data.personal.title}
          </p>
        </div>

        {/* Game Path */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">

          {[
            { label: "About", color: "bg-red-500", id: "01", target: "board-about" },
            { label: "Skills", color: "bg-yellow-500", id: "02", target: "board-skills" },
            { label: "Projects", color: "bg-blue-500", id: "03", target: "board-projects" },
            { label: "Experience", color: "bg-green-500", id: "04", target: "board-experience" },
            { label: "Reviews", color: "bg-purple-500", id: "05", target: "board-testimonials" },
          ].map((tile, index) => (
            
            <motion.button
              key={index}
            onClick={() => scrollToSection(tile.target)}
              
              whileHover={{
                scale: 1.15,
                rotate: 5,
              }}
              
              className="flex flex-col items-center  cursor-pointer "
            >
              <div
                className={`
                  ${tile.color}
                  w-24 h-24
                  rounded-3xl
                  flex items-center justify-center
                  text-white font-black text-2xl
                  shadow-[0_0_30px_rgba(255,255,255,0.3)]
                `}
              >
                {tile.id}
              </div>
         
              <span className="mt-3 text-slate-300">
                {tile.label}
              </span>
            </motion.button>
            
          ))}
        </div>

        {/* Player Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            mt-16
            bg-slate-900/70
            backdrop-blur
            border border-slate-700
            rounded-3xl
            p-8
            max-w-2xl
            text-center
          "
        >
          <img
            src={data.personal.avatar}
            alt={data.personal.name}
            className="
              w-32 h-32
              rounded-full
              mx-auto
              border-4 border-yellow-400
            "
          />

          <h2 className="text-white text-3xl font-bold mt-4">
            Player Profile
          </h2>

          <p className="text-slate-400 mt-3">
            Complete all checkpoints and discover my journey,
            skills, projects and achievements.
          </p>

          <button
            onClick={startJourney}
            disabled={rolling}
            className="
              mt-6
              px-8 py-4
              bg-yellow-500
              hover:bg-yellow-400
              rounded-2xl
              text-black
              font-bold
              flex items-center gap-2
              mx-auto
              transition-all
              disabled:opacity-80
            "
          >
   
            <Play size={16} />
             {rolling
              ? "🎲 Rolling Dice..."
              : "🎮 Start Adventure"}
          </button>
        </motion.div>

      </div>
    </section>
  );
}