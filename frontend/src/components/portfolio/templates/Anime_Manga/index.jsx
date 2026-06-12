import React from 'react';
import Hero from './Hero';
import About from './About';
import CharacterStats from './CharacterStats';
import Projects from './Projects';
import ResumeCTA from './ResumeCTA';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function AnimeMangaTemplate({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white min-h-screen text-black font-sans relative overflow-hidden selection:bg-black selection:text-white pb-20">
      <style>{`
        .manga-screentone {
          background-image: radial-gradient(#000 1px, transparent 1px);
          background-size: 6px 6px;
        }
        .manga-panel {
          background-color: white;
          border: 4px solid black;
          box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .manga-panel:hover {
          transform: translate(-4px, -4px);
          box-shadow: 12px 12px 0px 0px rgba(0,0,0,1);
        }
        .action-lines {
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #000 10px,
            #000 12px
          );
        }
        .manga-title {
          font-family: 'Impact', 'Arial Black', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          -webkit-text-stroke: 1px black;
        }
      `}</style>
      
      {/* Decorative background speed lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full manga-screentone" />
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-16 relative z-10">
        <div className="manga-panel p-4 md:p-8 relative overflow-hidden">
          <Hero data={data} />
        </div>
        
        <div className="manga-panel p-4 md:p-8">
          <About data={data} />
        </div>

        <div className="manga-panel p-4 md:p-8">
          <CharacterStats data={data} />
        </div>

        <Skills skills={data.skills} />
        
        <Experience experience={data.experience} />
        
        <div className="manga-panel p-4 md:p-8">
          <Projects projects={data.projects} />
        </div>

        <Testimonials testimonials={data.testimonials} />

        <div className="manga-panel p-4 md:p-8">
          <ResumeCTA data={data} />
        </div>

        <Contact personal={data.personal} socials={data.socials} />
      </div>
    </div>
  );
}
