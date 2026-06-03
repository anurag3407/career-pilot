
import React from 'react';

import data from '../../../../data/dummy_data.json';

import Hero from './Hero';
import About from "./About";
import Contact from './Contact';
import Experience from './Experience';
import Projects from './Projects';
import Skills from './Skills';
import Testimonials from './Testimonials';


// Main Component
const MuseumGallery = ({ portfolioData }) => {
   const templateData = portfolioData ?? data;
  
  return (
    <div className="min-h-screen bg-amber-50 font-sans">
         <Hero data={templateData}/>
      <About data={templateData}/>
      <Skills data={templateData}/>
      <Projects data={templateData}/>
      <Experience data={templateData}/>
      <Testimonials data={templateData}/>
      <Contact data={templateData}/>
    </div>
  );
};

export default MuseumGallery;