import React from 'react';
import data from '../../../../data/dummy_data.json';
import Hero from './Hero';
import StatsBar from './StatsBar';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function RealEstateLuxury() {
  return (
    <div
      style={{
        backgroundColor: '#0A0A0F',
        color: '#F5F0E8',
        fontFamily: 'Jost, sans-serif',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');`}</style>
      <Hero data={data} />
      <StatsBar data={data} />
      <About data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Experience data={data} />
      <Testimonials data={data} />
      <Contact data={data} />
    </div>
  );
}
