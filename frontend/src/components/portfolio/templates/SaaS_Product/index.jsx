import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import StatsBar from './StatsBar';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import CTABanner from './CTABanner';
import Contact from './Contact';

export default function SaaSProduct() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div
      style={{
        backgroundColor: '#0D0D12',
        color: '#F1F0FF',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        minHeight: '100vh',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .saas-gradient-text {
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .saas-heading-gradient {
          background: linear-gradient(135deg, #F1F0FF 0%, #8884A8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping { animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite; }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          opacity: 0.03,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar data={data} />
        <Hero data={data} />
        <StatsBar data={data} />
        <About data={data} />
        <Skills data={data} />
        <Projects data={data} />
        <Experience data={data} />
        <Testimonials data={data} />
        <CTABanner data={data} />
        <Contact data={data} />
      </div>
    </div>
  );
}
