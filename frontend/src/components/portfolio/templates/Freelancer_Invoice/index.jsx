import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import Hero from './Hero';
import Services from './Services';
import InvoiceSection from './InvoiceSection';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';

/**
 * Freelancer Invoice Portfolio Template
 * Category: Professional / Industry
 * Description: Freelancer profile with services/pricing cards, invoice-style project breakdown,
 * hourly rate display. Clean, professional, business-focused. Inspired by Stripe Dashboard,
 * Upwork Pro, Notion Invoice, and modern consulting portfolio aesthetics.
 */
export default function FreelancerInvoice({ portfolioData }) {
  const { portfolioData: dummyData } = usePortfolio();

  // Merge AI data with dummyData
  const personal = {
    ...dummyData.personal,
    ...(portfolioData?.hero?.subtitle && { name: portfolioData.hero.subtitle }),
    ...(portfolioData?.hero?.title && { title: portfolioData.hero.title }),
    ...(portfolioData?.hero?.tagline && { tagline: portfolioData.hero.tagline }),
    ...(portfolioData?.about?.bio && { bio: portfolioData.about.bio }),
  };

  const socials = { ...dummyData.socials, ...portfolioData?.socials };

  let skills = dummyData.skills;
  if (portfolioData?.skills?.length > 0) {
    if (typeof portfolioData.skills[0] === 'string') {
      const categories = ["Core", "Technical", "Additional"];
      skills = portfolioData.skills.map((s, i) => ({
        name: s,
        level: Math.floor(Math.random() * 20) + 75,
        category: categories[i % categories.length]
      }));
    } else {
      skills = portfolioData.skills;
    }
  }

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

  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        fontFamily: 'Inter, sans-serif',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #2563EB; border-radius: 3px; }

        .fi-gradient-text {
          background: linear-gradient(135deg, #1E40AF 0%, #2563EB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .fi-btn-primary {
          background: linear-gradient(135deg, #1E40AF 0%, #2563EB 100%);
          color: #fff;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(37,99,235,0.35);
        }
        .fi-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37,99,235,0.45);
        }
        .fi-btn-outline {
          background: transparent;
          color: #2563EB;
          border: 2px solid #2563EB;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .fi-btn-outline:hover {
          background: #2563EB;
          color: #fff;
          transform: translateY(-2px);
        }
        .fi-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        .fi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: #93C5FD;
        }
        .fi-progress-bar {
          height: 6px;
          background: #E5E7EB;
          border-radius: 3px;
          overflow: hidden;
        }
        .fi-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #1E40AF, #2563EB);
          border-radius: 3px;
          transition: width 1.2s ease;
        }
        .fi-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 20px;
          background: rgba(37,99,235,0.08);
          color: #2563EB;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .fi-invoice-paper {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
        }
        .fi-invoice-paper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1E40AF, #2563EB, #3B82F6);
        }
        .fi-timeline-line {
          position: absolute;
          left: 11px;
          top: 24px;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #2563EB, #93C5FD, transparent);
        }
        .fi-nav-link {
          color: #64748B;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
          position: relative;
        }
        .fi-nav-link:hover {
          color: #2563EB;
        }
        .fi-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #2563EB;
          transition: width 0.2s ease;
        }
        .fi-nav-link:hover::after {
          width: 100%;
        }
        @keyframes fi-fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fi-pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes fi-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .fi-animate-float { animation: fi-float 4s ease-in-out infinite; }
        .fi-status-available {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(34,197,94,0.12);
          color: #16A34A;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .fi-dot-green {
          width: 7px;
          height: 7px;
          background: #22C55E;
          border-radius: 50%;
          animation: fi-pulse-dot 2s ease-in-out infinite;
        }
        .fi-table th {
          background: #F8FAFC;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #64748B;
          padding: 10px 14px;
          border-bottom: 1px solid #E5E7EB;
        }
        .fi-table td {
          padding: 10px 14px;
          font-size: 13px;
          color: #374151;
          border-bottom: 1px solid #F1F5F9;
        }
        .fi-table tr:last-child td { border-bottom: none; }
        .fi-hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          background: #0F172A;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        @media (max-width: 768px) {
          .fi-hero-grid { grid-template-columns: 1fr !important; }
          .fi-three-col { grid-template-columns: 1fr !important; }
          .fi-two-col { grid-template-columns: 1fr !important; }
          .fi-projects-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1024px) {
          .fi-projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <Hero data={data} />
      <Services data={data} />
      <InvoiceSection data={data} />
      <About data={data} />
      <Skills data={data} />
      <Experience data={data} />
      <Projects data={data} />
      <Testimonials data={data} />
      <Contact data={data} />
    </div>
  );
}