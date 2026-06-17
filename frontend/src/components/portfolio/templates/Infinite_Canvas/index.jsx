import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";

import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Experience from "./Experience";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import CanvasBackground from "./CanvasBackground";

/**
 * Infinite Canvas Portfolio Template
 * Category: Scroll-Triggered
 * Description:
 * Infinite scrolling canvas with projects placed at various
 * spatial positions. Feels like navigating a digital whiteboard.
 */
export default function InfiniteCanvas() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] text-white">
      <CanvasBackground />

      {/* Canvas Container */}
      <div className="relative w-full min-h-[5200px]">
        {/* Hero */}
        <Hero data={data} />

        {/* About */}
        <About data={data} />

        {/* Skills */}
        <Skills data={data} />

        {/* Projects */}
        <Projects data={data} />

        {/* Experience */}
        <Experience data={data} />

        {/* Testimonials */}
        <Testimonials data={data} />

        {/* Contact */}
        <Contact data={data} />
      </div>
    </div>
  );
}