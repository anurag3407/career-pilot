import React from 'react';
import data from '../../../../data/dummy_data.json';
import { GooeyFilter } from './Shared';
import LavaBackground from './LavaBackground';
import NavBar from './NavBar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

const LavaLampPortfolio = () => {
  return (
    <div className="min-h-screen font-serif text-[#2b1318] selection:bg-[#f28e2b] selection:text-[#2b1318] bg-[#2b1318] relative overflow-hidden">
      <GooeyFilter />
      <LavaBackground />
      <NavBar />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Hero data={data} />
        <About data={data} />
        <Skills data={data} />
        <Projects data={data} />
        <Experience data={data} />
        <Testimonials data={data} />
        <Contact data={data} />
      </div>
    </div>
  );
};

export default LavaLampPortfolio;