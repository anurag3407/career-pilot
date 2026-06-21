import React from "react";
import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";
import ResumeCTA from "./ResumeCTA";
import FloatingWidgets from "./FloatingWidgets";

export default function GlassmorphismTemplate() {
  return (
    <div>
      <Hero />
      <About />
      <Projects />
      <ResumeCTA />
      <Contact />
      <FloatingWidgets />
    </div>
  );
}