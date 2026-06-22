import React from 'react';
import dummyData from '../../../../data/dummy_data.json';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Contact from './Contact';

export default function CeramicMinimal() {
  if (!dummyData) {
    return <div className="flex items-center justify-center min-h-screen">Loading portfolio...</div>;
  }

  return (
    <main className="bg-white text-gray-900">
      <Hero data={dummyData.personal} socials={dummyData.socials} stats={dummyData.stats} />
      <About data={dummyData.personal} />
      <Skills skills={dummyData.skills} />
      <Projects projects={dummyData.projects} />
      <Experience experience={dummyData.experience} />
      <Contact socials={dummyData.socials} email={dummyData.socials?.email}/>
    </main>
  );
}
