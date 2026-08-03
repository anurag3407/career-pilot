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

export default function InfiniteCanvas() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] text-white">
      <CanvasBackground />

      <main className="relative z-10">
        {/* Hero */}
        <section>
          <Hero data={data} />
        </section>

        {/* About + Skills */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <About data={data} />
            <Skills data={data} />
          </div>
        </section>

        {/* Infinite Canvas Projects */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <Projects data={data} />
        </section>

        {/* Experience + Testimonials */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <Experience data={data} />
            <Testimonials data={data} />
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <Contact data={data} />
        </section>
      </main>
    </div>
  );
}