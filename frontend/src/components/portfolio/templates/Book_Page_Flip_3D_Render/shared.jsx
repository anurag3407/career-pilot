import React, { useEffect, useState, useRef } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

// Default biography data fallback
export const localDefault = {
  personal: {
    name: "Arthur Pendelton",
    title: "Master Cartographer & Archivist",
    email: "arthur.pendelton@archivist.org",
    phone: "+44 (0) 20 7946 0192",
    location: "Edinburgh, Scotland",
    bio: "Dedicated to preserving historical records, mapping forgotten geographies, and developing digital archives. Specializing in visual history, interactive cartography, and high-fidelity archival user interfaces.",
    avatar: "",
    website: "https://arthurpendelton.org",
    tagline: "Bridging the gap between historic craftsmanship and modern digital preservation."
  },
  skills: [
    { name: "Archival Conservation", level: 98, category: "Core Craft" },
    { name: "Cartographic Design", level: 95, category: "Core Craft" },
    { name: "Interactive Mapping", level: 92, category: "Digital" },
    { name: "Archival UI Design", level: 88, category: "Digital" },
    { name: "Paleography & Calligraphy", level: 90, category: "Traditional" },
    { name: "Historical Research", level: 96, category: "Traditional" }
  ],
  experience: [
    {
      role: "Lead Digital Archivist",
      company: "Royal Geographical Archives",
      period: "2021 - Present",
      description: "Spearheading the digitization and restoration of 17th-century navigational maps. Designed an interactive high-resolution GIS map explorer for scholars worldwide."
    },
    {
      role: "Manuscript Conservator",
      company: "National Library of Scotland",
      period: "2017 - 2021",
      description: "Restored fragile medieval manuscripts. Curated public exhibitions on early printing methodologies. Built local digital displays using web UI tech."
    }
  ],
  projects: [
    {
      title: "The Mapped Chronicles",
      description: "An interactive, web-based map explorer tracing 16th-century sea voyage logs. Users can compare vintage cartography with satellite data.",
      techStack: ["React", "GIS Maps", "SVG Engine"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Calligraphy Simulation",
      description: "A canvas-based brush simulator mimicking wet ink on porous antique parchment, adjusting for pressure and angle.",
      techStack: ["HTML5 Canvas", "WebGL", "Vanilla JS"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Archival Database System",
      description: "A secure cataloging system for historical archives utilizing metadata standards and advanced keyword indexing.",
      techStack: ["PostgreSQL", "Node.js", "React"],
      liveUrl: "#",
      githubUrl: "#"
    }
  ],
  education: [
    {
      degree: "M.Sc. in Archives & Records Management",
      institution: "University of Edinburgh",
      year: "2017",
      location: "Edinburgh, UK",
      description: "Specialized in historical preservation methodologies and digital archival structures."
    }
  ],
  testimonials: [
    {
      name: "Dr. Clara Sterling",
      role: "Director of Research at Royal Society",
      text: "Arthur has a rare ability to translate the tactile feel of classic parchment and hand-drawn maps into beautiful, interactive digital layouts."
    }
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  }
};

// Hook to load portfolio data and resolve fallback merging
export function useResolvedData(portfolioData, localData) {
  const context = usePortfolio();
  const incoming = portfolioData || localData || context?.portfolioData || {};

  const personal = { ...localDefault.personal, ...incoming.personal, ...(incoming.personalInfo || {}) };
  const experience = incoming.experience && incoming.experience.length > 0 ? incoming.experience : localDefault.experience;
  const projects = incoming.projects && incoming.projects.length > 0 ? incoming.projects : localDefault.projects;
  const skills = incoming.skills && incoming.skills.length > 0 ? incoming.skills : localDefault.skills;
  const education = incoming.education && incoming.education.length > 0 ? incoming.education : localDefault.education;
  const testimonials = incoming.testimonials && incoming.testimonials.length > 0 ? incoming.testimonials : localDefault.testimonials;
  const socials = { ...localDefault.socials, ...incoming.socials };

  return { personal, experience, projects, skills, education, testimonials, socials };
}

// Hook to calculate size of a single book page
export function useBookSize() {
  const [size, setSize] = useState({ width: 520, height: 680 });

  useEffect(() => {
    const updateSize = () => {
      let width = 520;
      let height = 680;

      if (window.innerWidth < 768) {
        // Mobile view: single page fits the screen width with a small margin
        width = window.innerWidth - 32;
        height = window.innerHeight - 120;
      } else {
        // Desktop view: single page is sized based on viewport bounds
        const maxSingleWidth = Math.min(540, (window.innerWidth - 120) / 2);
        const maxSingleHeight = Math.min(720, window.innerHeight - 150);
        
        // Classic book page ratio (approx. 1:1.3)
        width = maxSingleWidth;
        height = Math.min(maxSingleHeight, width * 1.33);
      }

      setSize({ width: Math.floor(width), height: Math.floor(height) });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

// Hook to handle wheel-based page flips
export function useWheelFlip(bookRef) {
  const lockRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleWheel = (event) => {
      const pageFlip = bookRef.current?.pageFlip?.();
      if (!pageFlip) return;

      const target = event.target;
      const scrollableParent = target.closest('.custom-scrollbar, .overflow-y-auto');
      
      if (scrollableParent) {
        const isAtTop = scrollableParent.scrollTop === 0;
        const isAtBottom = scrollableParent.scrollHeight - scrollableParent.scrollTop <= scrollableParent.clientHeight + 1;

        if (event.deltaY < 0 && !isAtTop) return;
        if (event.deltaY > 0 && !isAtBottom) return;
      }

      if (Math.abs(event.deltaY) < 15) return;
      if (lockRef.current) return;

      event.preventDefault();

      if (event.deltaY > 0) {
        pageFlip.flipNext();
      } else if (event.deltaY < 0) {
        pageFlip.flipPrev();
      }

      lockRef.current = true;
      timerRef.current = window.setTimeout(() => {
        lockRef.current = false;
        timerRef.current = null;
      }, 700);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [bookRef]);
}

// Font loading component
export function GoogleFontsLink() {
  useEffect(() => {
    // Avoid double loading
    if (document.getElementById('google-fonts-book-flip')) return;

    const link = document.createElement('link');
    link.id = 'google-fonts-book-flip';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=IM+Fell+English+SC&display=swap';
    document.head.appendChild(link);
  }, []);

  return null;
}
