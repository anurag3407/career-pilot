import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Projects from "./Projects";
import SlotMachine from "./SlotMachine";
import Testimonials from "./Testimonials";
import ResumeCTA from "./ResumeCTA";
import Contact from "./Contact";

export default function CasinoVegas() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-yellow-500/30 selection:text-yellow-200">
      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Experience data={data} />
      <Projects data={data} />
      <SlotMachine data={data} />
      <Testimonials data={data} />
      <ResumeCTA data={data} />
      <Contact data={data} />
    </div>
  );
}
