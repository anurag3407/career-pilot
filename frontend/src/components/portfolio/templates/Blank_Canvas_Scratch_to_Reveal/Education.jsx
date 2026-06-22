import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from './PortfolioContext';
import { BookOpen, Award, FileBadge } from 'lucide-react';

const defaultEducation = [
  {
    degree: 'Master of Science in Computer Science',
    school: 'Stanford University',
    period: '2016 – 2018',
    description: 'Specialized in Intelligent Systems and Distributed Software Architectures. Graduated with Honors.'
  },
  {
    degree: 'Bachelor of Science in Software Engineering',
    school: 'UC Berkeley',
    period: '2012 – 2016',
    description: 'Double minor in Cognitive Science & Art Practice. Active lead in open-source developer student groups.'
  }
];

const defaultCertifications = [
  {
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2023'
  },
  {
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    date: '2022'
  }
];

const defaultAwards = [
  {
    title: 'Awwwards Site of the Day',
    event: 'Portfolio Showcase Exhibit',
    date: '2025'
  },
  {
    title: 'First Place Winner',
    event: 'Global Tech Hackathon (Vercel Core Prize)',
    date: '2023'
  }
];

export default function Education() {
  const { portfolioData } = usePortfolio();

  // Safely resolve education from various potential schema keys
  const education = portfolioData?.education?.length > 0
    ? portfolioData.education.map(e => ({
        degree: e.degree || e.degreeName || e.fieldOfStudy || 'Degree',
        school: e.school || e.schoolName || e.institution || 'University',
        period: e.period || e.year || `${e.startDate || ''} – ${e.endDate || ''}`.trim() || 'Period',
        description: e.description || e.details || ''
      }))
    : defaultEducation;

  const certifications = portfolioData?.certifications?.length > 0
    ? portfolioData.certifications.map(c => ({
        name: c.name || c.title || 'Certification',
        issuer: c.issuer || c.organization || 'Issuer',
        date: c.date || c.year || 'Date'
      }))
    : defaultCertifications;

  const awards = portfolioData?.awards?.length > 0
    ? portfolioData.awards.map(a => ({
        title: a.title || a.name || 'Award',
        event: a.event || a.organization || 'Event',
        date: a.date || a.year || 'Date'
      }))
    : defaultAwards;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut' }
    }
  };

  return (
    <section 
      id="education" 
      className="relative py-28 md:py-36 px-6 border-b border-slate-900/60 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">[[ 05 // Credentials ]]</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold font-outfit text-white mb-6"
          >
            Education & Recognition
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto font-light"
          >
            Academic background, professional licenses, and awards.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Left: Ruled Notebook Education Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-900/80 pb-3 mb-6">
              <BookOpen className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-semibold font-outfit tracking-wide text-white">
                Education
              </h3>
            </div>

            <div className="space-y-6">
              {education.map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={cardVariants}
                  className="relative bg-[#040409]/90 border border-slate-900 rounded-xl overflow-hidden group hover:border-slate-800 transition-all duration-300"
                >
                  <div className="p-6 h-full relative">
                    {/* Ruled Notebook Paper Aesthetic */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_1.5rem] pointer-events-none z-0 opacity-80" />
                    
                    {/* Neutral margin line */}
                    <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-white/10 z-0" />

                    <div className="relative z-10 pl-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h4 className="text-base font-bold font-outfit text-white group-hover:text-white transition-colors">
                            {item.degree}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                            {item.school}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-slate-500 shrink-0">
                          {item.period}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-light text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Certifications & Awards */}
          <div className="lg:col-span-5 space-y-10">
            {/* Certifications Card Deck */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-900/80 pb-3">
                <FileBadge className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold font-outfit tracking-wide text-white">
                  Certifications
                </h3>
              </div>

              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    className="bg-[#05050c]/80 border border-slate-900 rounded-xl overflow-hidden hover:border-slate-800/80 transition-all p-4 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{cert.name}</h4>
                      <p className="text-xs text-slate-500 font-light mt-0.5">{cert.issuer}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 font-medium shrink-0 ml-4">
                      {cert.date}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Awards Card Deck */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-900/80 pb-3">
                <Award className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold font-outfit tracking-wide text-white">
                  Awards & Honors
                </h3>
              </div>

              <div className="space-y-4">
                {awards.map((award, idx) => (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    className="bg-[#05050c]/80 border border-slate-900 rounded-xl overflow-hidden hover:border-slate-800/80 transition-all p-4 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{award.title}</h4>
                      <p className="text-xs text-slate-500 font-light mt-0.5">{award.event}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 font-medium shrink-0 ml-4">
                      {award.date}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
