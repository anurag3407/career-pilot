"use client";

import React from "react";
import Background from "./components/Background";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function GradientMeshArt() {
  return (
    <main className="relative min-h-screen bg-[#050712] text-white overflow-hidden">
      <Background />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}

/**
 * Gradient Mesh Art Portfolio Template
 * Category: Colorful / Vibrant
 * Description: Artistic gradient mesh blobs as hero backgrounds and section dividers. Vivid blends of complementary colors. Abstract art meets web design.
 */
