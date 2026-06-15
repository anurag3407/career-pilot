import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Section imports
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Experience from "./Experience";
import Testimonials from "./Testimonials";
import Contact from "./Contact";

const CherryBlossom = ({ portfolioData }) => {
  const { portfolioData: dummyData } = usePortfolio();

  // Merge AI extracted data with dummy data fallbacks for visual completeness
  const personal = {
    ...dummyData.personal,
    ...(portfolioData?.hero?.subtitle && { name: portfolioData.hero.subtitle }),
    ...(portfolioData?.hero?.title && { title: portfolioData.hero.title }),
    ...(portfolioData?.hero?.tagline && { tagline: portfolioData.hero.tagline }),
    ...(portfolioData?.about?.bio && { bio: portfolioData.about.bio }),
  };

  const socials = { ...dummyData.socials, ...portfolioData?.socials };
  
  // Adapt skills array from simple strings to richer objects for the UI
  let skills = dummyData.skills;
  if (portfolioData?.skills?.length > 0) {
    if (typeof portfolioData.skills[0] === 'string') {
      const categories = ["Core", "Technical", "Additional"];
      skills = portfolioData.skills.map((s, i) => ({
        name: s,
        level: Math.floor(Math.random() * 20) + 75, // Random 75-95%
        category: categories[i % categories.length]
      }));
    } else {
      skills = portfolioData.skills;
    }
  }

  // Adapt projects to ensure they have images and URLs
  let projects = dummyData.projects;
  if (portfolioData?.projects?.length > 0) {
    projects = portfolioData.projects.map((p, i) => ({
      title: p.title || p.name || 'Project',
      description: p.description || '',
      techStack: p.technologies || p.techStack || [],
      image: p.image || dummyData.projects[i % dummyData.projects.length].image,
      liveUrl: p.liveUrl || "#",
      githubUrl: p.githubUrl || "#"
    }));
  }

  const experience = portfolioData?.experience?.length > 0 ? portfolioData.experience : dummyData.experience;
  const testimonials = portfolioData?.testimonials?.length > 0 ? portfolioData.testimonials : dummyData.testimonials;
  const stats = portfolioData?.stats || dummyData.stats;

  const data = { personal, socials, skills, projects, experience, testimonials, stats };

  const [petals, setPetals] = useState([]);

  useEffect(() => {
    setPetals([...Array(50)].map((_, i) => ({
      id: i,
      initial: {
        opacity: 0,
        y: -50,
        x: Math.random() * 100 + "vw",
        rotate: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.7,
      },
      animate: {
        opacity: [0, 1, 1, 0],
        y: "110vh",
        x: `${Math.random() * 100 - 50}vw`,
        rotate: Math.random() * 1000,
      },
      transition: {
        duration: 10 + Math.random() * 15,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 15,
      },
    })));
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-pink-50 via-white to-rose-100 text-gray-800">
      {/* Falling Sakura Petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={petal.initial}
            animate={petal.animate}
            transition={petal.transition}
            className="absolute w-5 h-5 bg-pink-300/70 rounded-[100%_10%_100%_10%] shadow-lg"
          />
        ))}
      </div>

      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Experience data={data} />
      <Testimonials data={data} />
      <Contact data={data} />
    </div>
  );
};

export default CherryBlossom;
