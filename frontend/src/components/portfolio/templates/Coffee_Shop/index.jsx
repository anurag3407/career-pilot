import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import MenuBoard from './MenuBoard';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';
import ResumeCTA from './ResumeCTA';

const CoffeeShop = () => {
  const { portfolioData } = usePortfolio();
  
  return (
    <div className="bg-[#161210] min-h-screen text-[#fbf9f3] selection:bg-amber-900/50 selection:text-amber-200 font-sans">
      <MenuBoard data={portfolioData} />
      <Skills />
      <Experience />
      <ResumeCTA />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default CoffeeShop;
