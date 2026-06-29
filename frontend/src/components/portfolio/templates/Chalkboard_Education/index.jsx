import React from "react";
import Hero from "./Hero";
import Projects from "./Projects";
import Experience from "./Experience";
import Skills from "./Skills";
import Testimonials from "./Testimonials";
import Contact from "./Contact";

export default function ChalkboardEducation() {
  return (
    <div className="bg-[#061121] min-h-screen font-sans selection:bg-cyan-300/30 selection:text-slate-900">
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <Testimonials />
      <Contact />
    </div>
  );
}
