import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import ServicesGrid from './ServicesGrid';
import ArticlesList from './ArticlesList';
import FAQSection from './FAQSection';
import Testimonials from './Testimonials';
import ContactForm from './ContactForm';

// Helper component for Marquee text
const MarqueeText = ({ text }) => (
  <div className="relative flex overflow-x-hidden w-full bg-[#0E1018] rounded-xl border border-white/5 py-3">
    <div className="animate-marquee whitespace-nowrap flex items-center">
      <span className="mx-4 font-semibold text-sm tracking-widest text-slate-300">{text}</span>
      <span className="mx-4 font-semibold text-sm tracking-widest text-slate-300">{text}</span>
      <span className="mx-4 font-semibold text-sm tracking-widest text-slate-300">{text}</span>
      <span className="mx-4 font-semibold text-sm tracking-widest text-slate-300">{text}</span>
    </div>
    <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center">
      <span className="mx-4 font-semibold text-sm tracking-widest text-slate-300">{text}</span>
      <span className="mx-4 font-semibold text-sm tracking-widest text-slate-300">{text}</span>
      <span className="mx-4 font-semibold text-sm tracking-widest text-slate-300">{text}</span>
      <span className="mx-4 font-semibold text-sm tracking-widest text-slate-300">{text}</span>
    </div>
  </div>
);

// Fallback images for logos
const LOGOS = {
  freelancer: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  upwork: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
  popway: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg',
  visitorz: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'
};

const SKILL_LOGOS = [
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original-wordmark.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original-wordmark.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain-wordmark.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
];

const ContentArea = ({ data, theme }) => {
  const { projects, stats } = data || {};

  // Animations
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const EXPERIENCES = [
    { title: 'Freelancer', comp: 'Software Developer', years: '2021-2025', logo: LOGOS.freelancer },
    { title: 'Popway Software', comp: 'Software Developer', years: '2025-2025', logo: LOGOS.popway },
    { title: 'Upwork', comp: 'Software Engineer', years: '2021-2025', logo: LOGOS.upwork },
    { title: 'Visitorz.io', comp: 'Internship', years: '2024-2025', logo: LOGOS.visitorz }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <motion.div key="home" variants={containerVars} initial="hidden" animate="visible" className="flex flex-col gap-6 w-full font-sans">
            {/* Intro Stats & Tech Stack Marquee */}
            <motion.div variants={itemVars} className="p-8 sm:p-10 rounded-[32px] shadow-lg w-full" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div>
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stats?.yearsExperience || '2'}+</div>
                  <div className="text-sm md:text-base font-bold text-slate-400">Years of<br/>Experience</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">10+</div>
                  <div className="text-sm md:text-base font-bold text-slate-400">Technologies<br/>Mastered</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stats?.projectsCompleted || '50'}+</div>
                  <div className="text-sm md:text-base font-bold text-slate-400">Successful<br/>Projects</div>
                </div>
              </div>

              <h2 className="text-2xl font-extrabold mb-8 text-white">
                Worked With 50+ Brands Worldwide | .NET Developer
              </h2>

              <div className="flex flex-col gap-4 overflow-hidden relative w-full pt-4">
                <div className="flex gap-4 animate-marquee whitespace-nowrap">
                  {[...SKILL_LOGOS, ...SKILL_LOGOS].map((url, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-110 p-4 bg-[#0E1018] border border-white/5">
                      <img src={url} className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all" alt="tech" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap">
                  {[...SKILL_LOGOS, ...SKILL_LOGOS].reverse().map((url, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-110 p-4 bg-[#0E1018] border border-white/5">
                      <img src={url} className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all" alt="tech" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            {/* Testimonials snippet for Home */}
            <Testimonials theme={theme} />
          </motion.div>
        );
      
      case 'Services':
        return (
          <motion.div key="services" variants={containerVars} initial="hidden" animate="visible" className="flex flex-col gap-6 w-full font-sans">
            <ServicesGrid theme={theme} />
          </motion.div>
        );

      case 'Works':
        return (
          <motion.div key="works" variants={containerVars} initial="hidden" animate="visible" className="flex flex-col gap-6 w-full font-sans">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                {/* Work Experience */}
                <motion.div variants={itemVars} className="p-8 rounded-[32px] shadow-lg overflow-hidden relative h-[450px]" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
                  <h2 className="text-2xl font-extrabold mb-6 text-white absolute top-8 left-8 z-10 bg-[#13161F]/90 px-2 py-1 rounded">Work Experience</h2>
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#13161F] to-transparent z-10 pointer-events-none"></div>
                  <div className="flex flex-col gap-4 animate-marquee-vertical pt-20">
                    {[...EXPERIENCES, ...EXPERIENCES].map((exp, idx) => (
                      <div key={idx} className="flex items-center gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 mx-2">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 p-2 shadow-inner" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
                          <img src={exp.logo} alt={exp.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-extrabold text-white truncate">{exp.title}</h3>
                          <p className="text-sm font-semibold truncate text-slate-400">{exp.comp}</p>
                        </div>
                        <div className="text-sm font-bold shrink-0 text-slate-500">
                          {exp.years}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#13161F] to-transparent z-10 pointer-events-none"></div>
                </motion.div>

                {/* Certificates */}
                <motion.div variants={itemVars} className="p-8 rounded-[32px] shadow-lg flex-1" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
                  <h2 className="text-2xl font-extrabold mb-6 text-white">Certificates</h2>
                  <div className="flex flex-col gap-4">
                     {['Advanced ASP.NET Core Architecture', 'Azure Cloud Developer Associate'].map((cert, idx) => (
                       <div key={idx} className="flex items-center gap-4 bg-[#0E1018] p-4 rounded-2xl border border-white/5 cursor-pointer hover:border-blue-500/50 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex text-blue-400 items-center justify-center shrink-0 font-bold">C</div>
                          <span className="font-bold text-sm text-slate-200">{cert}</span>
                       </div>
                     ))}
                  </div>
                </motion.div>
              </div>

              {/* Recent Projects */}
              <motion.div variants={itemVars} className="p-8 rounded-[32px] shadow-lg flex flex-col h-full" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-extrabold text-white">Recent Projects</h2>
                  <button className="flex items-center gap-1 text-sm font-bold hover:underline text-[#4770FF]">
                    All Projects <ArrowRight size={14} />
                  </button>
                </div>

                <div className="flex flex-col gap-6 flex-1">
                  {(projects?.length > 0 ? projects.slice(0, 3) : [
                    { title: 'Shifra, Your Virtual Assistant', category: 'Ai', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop' },
                    { title: 'Product Developing', category: 'Web', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop' },
                    { title: 'Neon Cipher', category: 'Cyber', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop' }
                  ]).map((proj, idx) => (
                    <motion.div key={idx} whileHover={{ scale: 1.02 }} className="group relative rounded-2xl overflow-hidden cursor-pointer h-48 md:h-56 border" style={{ borderColor: theme.border, backgroundColor: '#0E1018' }}>
                      <img src={proj.image || proj.imageUrl} alt={proj.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="self-start px-3 py-1 rounded-lg text-xs font-extrabold mb-2 shadow-sm bg-white text-black">
                          {proj.category || 'Ai'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <MarqueeText text="Let's Work Together • Let's Work Together" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'Blogs':
        return (
          <motion.div key="blogs" variants={containerVars} initial="hidden" animate="visible" className="flex flex-col gap-6 w-full font-sans">
            <ArticlesList theme={theme} />
          </motion.div>
        );

      case 'Contact':
        return (
          <motion.div key="contact" variants={containerVars} initial="hidden" animate="visible" className="flex flex-col gap-6 w-full font-sans">
            <ContactForm theme={theme} />
            <FAQSection theme={theme} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-[800px]">
      {renderTabContent()}

      <style>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 20s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 20s linear infinite;
        }
        .animate-marquee-vertical {
          animation: marquee-vertical 15s linear infinite;
        }
        
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marquee-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ContentArea;
