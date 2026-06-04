import React from 'react';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import ResumeCTA from './ResumeCTA';
import Contact from './Contact';
import MinesweeperMinigame from './MinesweeperMinigame';

/**
 * Windows 98 Portfolio Template
 * Category: Retro / Nostalgic
 * Description: Full nostalgic Windows 98 desktop experience — complete with draggable windows,
 * a working taskbar with Start menu and real-time clock, desktop icons, classic raised/sunken
 * borders, progress bars, and an authentic MS Sans Serif UI.
 */
export default function Windows98() {
  return (
    <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", minHeight: '100vh' }}>
      <Hero />
      <About />
      <Projects />
      <ResumeCTA />
      <MinesweeperMinigame />
      <Contact />
    </div>
  );
}
