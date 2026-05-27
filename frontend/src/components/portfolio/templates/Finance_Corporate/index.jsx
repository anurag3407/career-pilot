import React from "react";

import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";
import ResumeCTA from "./ResumeCTA";
import Contact from "./Contact";
import StockTicker from "./StockTicker";

export default function FinanceCorporate() {
  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-8">
      <Hero />
      <About />
      <Projects />
      <ResumeCTA />
      <StockTicker />
      <Contact />
    </div>
  );
}