import React, { useState, useEffect } from 'react';
import { usePortfolio, normalizePortfolioData } from '../../../../context/PortfolioContext';
import { ArrowUpRight, Github, Linkedin, Twitter, Mail, Globe, Sun, Moon } from 'lucide-react';

export default function TheAntiPortfolioNothingnessAbsoluteBlank({ portfolioData: propPortfolioData }) {
  const { portfolioData: contextPortfolioData } = usePortfolio();
  const rawData = propPortfolioData || contextPortfolioData;
  const data = normalizePortfolioData(rawData);

  const { personal, socials, skills, projects, experience, education, certifications } = data;

  // Local theme toggle with system preference fallback
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  // Safe normalization of data sections
  const skillList = (skills || []).map(s => {
    if (typeof s === 'string') return s;
    return s.name || '';
  }).filter(Boolean);

  const projectList = (projects || []).map(p => ({
    title: p.title || p.name || '',
    description: p.description || p.summary || '',
    tech: p.techStack || p.tech || p.technologies || [],
    liveUrl: p.liveUrl || p.link || '',
    githubUrl: p.githubUrl || '',
    image: p.image || ''
  })).filter(p => p.title);

  const expList = (experience || []).map(exp => ({
    role: exp.role || exp.title || '',
    company: exp.company || '',
    period: exp.period || (exp.startDate && exp.endDate ? `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}` : ''),
    description: exp.description || '',
    location: exp.location || ''
  })).filter(exp => exp.role || exp.company);

  const eduList = (education || []).map(edu => ({
    school: edu.school || '',
    degree: edu.degree || '',
    field: edu.field || '',
    period: (edu.startDate && edu.endDate) ? `${edu.startDate} – ${edu.endDate}` : edu.period || '',
    gpa: edu.gpa || '',
    description: edu.description || ''
  })).filter(e => e.school || e.degree);

  const certList = (certifications || []).map(cert => {
    if (typeof cert === 'string') {
      return { name: cert, year: '' };
    }
    return {
      name: cert.name || cert.label || cert.title || '',
      year: cert.year || cert.date || ''
    };
  }).filter(c => c.name);

  // Social link definitions
  const socialLinks = [
    { icon: Github, href: socials.github, label: 'GitHub' },
    { icon: Linkedin, href: socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: socials.twitter, label: 'Twitter' },
    { icon: Globe, href: socials.website || socials.portfolio, label: 'Website' },
    { icon: Mail, href: socials.email?.includes('@') ? `mailto:${socials.email}` : socials.email, label: 'Email' }
  ].filter(link => link.href);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 ${isDark ? 'bg-[#0a0a0a] text-neutral-100' : 'bg-[#ffffff] text-neutral-900'}`}>
      {/* Import custom elegant Google Fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        
        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .font-sans {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
      `}} />

      {/* Floating Header */}
      <header className="mx-auto max-w-5xl px-6 md:px-12 py-10 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900/50">
        <span className="font-sans text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-400 dark:text-neutral-500">
          The Anti-Portfolio
        </span>
        
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-full transition-colors cursor-pointer"
          aria-label="Toggle visual theme"
        >
          {isDark ? <Sun size={14} className="text-neutral-400" /> : <Moon size={14} className="text-neutral-600" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-6 md:px-12 pb-32">
        
        {/* HERO SECTION */}
        <section className="py-24 md:py-32 flex flex-col justify-center min-h-[60vh]">
          {personal.name && (
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-tight leading-none mb-6">
              {personal.name}
            </h1>
          )}
          {personal.title && (
            <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-neutral-500 dark:text-neutral-400 font-semibold mb-8">
              {personal.title}
            </p>
          )}
          {personal.tagline && (
            <p className="font-serif italic text-xl md:text-2xl text-neutral-400 dark:text-neutral-500 max-w-2xl font-light">
              — {personal.tagline}
            </p>
          )}
        </section>

        {/* BIO SECTION */}
        {personal.bio && (
          <section className="py-20 md:py-28 border-t border-neutral-100 dark:border-neutral-900/50">
            <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600 block mb-10">
              01 // Profile
            </span>
            <p className="font-serif text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed text-neutral-700 dark:text-neutral-300 max-w-4xl">
              {personal.bio}
            </p>
            {personal.location && (
              <p className="font-sans text-xs text-neutral-400 dark:text-neutral-500 mt-8 font-medium">
                Located in {personal.location}
              </p>
            )}
          </section>
        )}

        {/* PROJECTS SECTION */}
        {projectList.length > 0 && (
          <section className="py-20 md:py-28 border-t border-neutral-100 dark:border-neutral-900/50">
            <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600 block mb-10">
              02 // Selected Works
            </span>
            <div className="flex flex-col">
              {projectList.map((project, index) => (
                <div 
                  key={index} 
                  className="py-12 border-b border-neutral-100 dark:border-neutral-900/50 group flex flex-col md:flex-row md:items-start justify-between gap-6 hover:opacity-95 transition-opacity"
                >
                  <div className="max-w-2xl">
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-neutral-900 dark:text-neutral-100 mb-4">
                      {project.title}
                    </h3>
                    <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light mb-6">
                      {project.description}
                    </p>
                    {project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t, idx) => (
                          <span key={idx} className="font-sans text-[9px] tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 pt-2 shrink-0">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="font-sans text-xs tracking-wider uppercase text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
                      >
                        Code <ArrowUpRight size={12} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="font-sans text-xs tracking-wider uppercase text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
                      >
                        Live <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {expList.length > 0 && (
          <section className="py-20 md:py-28 border-t border-neutral-100 dark:border-neutral-900/50">
            <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600 block mb-10">
              03 // Experience
            </span>
            <div className="space-y-16">
              {expList.map((exp, index) => (
                <div key={index} className="grid md:grid-cols-4 gap-4 md:gap-8 items-start">
                  <div className="md:col-span-1 font-sans text-xs tracking-widest text-neutral-400 dark:text-neutral-500 uppercase pt-1">
                    {exp.period}
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="font-serif text-2xl font-light text-neutral-900 dark:text-neutral-100">
                      {exp.role}
                    </h3>
                    <p className="font-sans text-xs font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mt-1">
                      {exp.company} {exp.location && `· ${exp.location}`}
                    </p>
                    {exp.description && (
                      <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light mt-4 white-space-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {skillList.length > 0 && (
          <section className="py-20 md:py-28 border-t border-neutral-100 dark:border-neutral-900/50">
            <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600 block mb-10">
              04 // Expertises &amp; Tools
            </span>
            <p className="font-serif text-xl md:text-3xl font-light leading-loose text-neutral-600 dark:text-neutral-400 max-w-4xl">
              {skillList.map((skill, index) => (
                <React.Fragment key={index}>
                  <span className="text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity duration-200">
                    {skill}
                  </span>
                  {index < skillList.length - 1 && (
                    <span className="text-neutral-300 dark:text-neutral-800 mx-4 font-sans font-light">/</span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </section>
        )}

        {/* EDUCATION SECTION */}
        {eduList.length > 0 && (
          <section className="py-20 md:py-28 border-t border-neutral-100 dark:border-neutral-900/50">
            <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600 block mb-10">
              05 // Education
            </span>
            <div className="space-y-12">
              {eduList.map((edu, index) => (
                <div key={index} className="grid md:grid-cols-4 gap-4 md:gap-8 items-start">
                  <div className="md:col-span-1 font-sans text-xs tracking-widest text-neutral-400 dark:text-neutral-500 uppercase pt-1">
                    {edu.period}
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="font-serif text-2xl font-light text-neutral-900 dark:text-neutral-100">
                      {edu.school}
                    </h3>
                    <p className="font-sans text-xs font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mt-1">
                      {edu.degree} {edu.field && `in ${edu.field}`} {edu.gpa && `· GPA: ${edu.gpa}`}
                    </p>
                    {edu.description && (
                      <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light mt-4">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS SECTION */}
        {certList.length > 0 && (
          <section className="py-20 md:py-28 border-t border-neutral-100 dark:border-neutral-900/50">
            <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600 block mb-10">
              06 // Credentials
            </span>
            <div className="space-y-6 max-w-3xl">
              {certList.map((cert, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b border-neutral-100 dark:border-neutral-900/50">
                  <span className="font-serif text-xl text-neutral-800 dark:text-neutral-200">
                    {cert.name}
                  </span>
                  {cert.year && (
                    <span className="font-sans text-xs tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                      {cert.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT & SOCIALS SECTION */}
        <section className="py-20 md:py-28 border-t border-neutral-100 dark:border-neutral-900/50">
          <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600 block mb-10">
            07 // Contact &amp; Networks
          </span>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <div>
              <p className="font-serif text-xl text-neutral-400 dark:text-neutral-500 font-light mb-6">
                For briefings, transmissions, or inquiries.
              </p>
              {socials.email && (
                <a 
                  href={socials.email.includes('@') ? `mailto:${socials.email}` : socials.email}
                  className="font-serif text-3xl md:text-5xl font-light hover:underline text-neutral-900 dark:text-neutral-100 transition-all block break-all"
                >
                  {socials.email}
                </a>
              )}
            </div>
            
            {socialLinks.length > 0 && (
              <div className="flex flex-col gap-3 md:items-end">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-sans text-xs tracking-[0.15em] uppercase text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2"
                    >
                      <Icon size={12} /> {link.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-6 md:px-12 py-12 border-t border-neutral-100 dark:border-neutral-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-sans text-[10px] tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
          &copy; {new Date().getFullYear()} {personal.name}. All elements absolute.
        </p>
        <p className="font-sans text-[10px] tracking-widest text-neutral-300 dark:text-neutral-800 uppercase">
          Blank Space
        </p>
      </footer>
    </div>
  );
}
