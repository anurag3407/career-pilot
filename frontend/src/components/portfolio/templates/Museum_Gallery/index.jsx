
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
const MuseumGallery = () => {
  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      <Hero data={data}/>
      <About data={data}/>
      <Skills data={data}/>
      <Projects data={data}/>
      <Experience data={data}/>
      <Testimonials data={data}/>
      <Contact data={data}/>
    </div>
  );
};

export default MuseumGallery;