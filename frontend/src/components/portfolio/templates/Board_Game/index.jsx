
import React from "react";
import { motion } from "framer-motion";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Experience from "./Experience";
import Testimonials from "./Testimonials";
import Contact from "./Contact";

/**
 * Board Game Portfolio Template
 * Category: Unique / Creative
 * Description: Board game layout with winding game path with colored squares. Each square is a portfolio item. Dice roll animation to navigate. Cheerful aesthetic.
 */
export default function BoardGame() {
  return (
    <main className="relative min-h-screen text-white overflow-x-hidden bg-[#071126]">
  
      {/* Gaming Grid */}
       <div className="fixed inset-0 opacity-10 pointer-events-none">
           <div className="h-full w-full bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:80px_80px]" />
       </div>

      {/* Color Glows */}
       <div className="fixed top-20 left-20 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
       <div className="fixed top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
       <div className="fixed bottom-20 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
       <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10">

      {/* All sections */}
       </div>

      {/* Game Start Screen */}
      <Hero />
      <div className="flex justify-center -mt-8 mb-8">
        <div className="w-2 h-20 bg-slate-700 rounded-full" />
      </div>

      {/* Level 01 */}
      <section id="board-about">
        <About />
      </section>

      {/* Level 02 */}
      <section id="board-skills">
        <Skills />
      </section>

      {/* Level 03 */}
      <section id="board-projects">
        <Projects />
      </section>

      {/* Level 04 */}
      <section id="board-experience">
        <Experience />
      </section>

      {/* Level 05 */}
      <section id="board-testimonials">
        <Testimonials />
      </section>

      {/* Finish */}
      <div className="flex justify-center py-16">
        <div
          className="
            w-28 h-28
            rounded-full
            bg-yellow-500
            flex items-center justify-center
            text-5xl
            shadow-2xl
            animate-bounce
          "
        >
          🏆
        </div>
      </div>

      {/* Contact / End Game */}
      <section id="board-contact">
        <Contact />
      </section>

    </main>
  );
}
