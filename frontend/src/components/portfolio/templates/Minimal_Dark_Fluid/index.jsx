import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { Github, Linkedin, Mail, ExternalLink, FileText, Code2 } from 'lucide-react';

const Minimal_Dark_Fluid = () => {
  const { portfolioData } = usePortfolio();

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <p className="animate-pulse">Loading portfolio...</p>
      </div>
    );
  }

  const personal = portfolioData.personal || portfolioData.personalInfo || {};
  const {
    name = 'Developer Name',
    title = 'Software Engineer',
    bio = 'Full-stack developer building amazing things.',
    location = '',
  } = personal;
  
  const {
    socials = {},
    projects = [],
    skills = [],
    experience = [],
  } = portfolioData;

  const email = socials.email || personal.email || '';
  const github = socials.github || '#';
  const linkedin = socials.linkedin || '#';
  const resume = socials.resume || '#';

  // Tag color mapping simulating Chakra UI colorSchemes
  const getTagStyle = (tag) => {
    const t = tag.toLowerCase();
    if (t.includes('react')) return 'bg-blue-900/30 text-blue-300';
    if (t.includes('python')) return 'bg-orange-900/30 text-orange-300';
    if (t.includes('java') || t.includes('js')) return 'bg-yellow-900/30 text-yellow-300';
    if (t.includes('sass') || t.includes('css')) return 'bg-pink-900/30 text-pink-300';
    if (t.includes('flask') || t.includes('node') || t.includes('vue')) return 'bg-green-900/30 text-green-300';
    if (t.includes('laravel') || t.includes('angular')) return 'bg-red-900/30 text-red-300';
    if (t.includes('bootstrap') || t.includes('php')) return 'bg-purple-900/30 text-purple-300';
    if (t.includes('sql') || t.includes('db')) return 'bg-blue-900/30 text-blue-300';
    if (t.includes('next') || t.includes('vercel')) return 'bg-gray-800 text-gray-300';
    if (t.includes('chakra') || t.includes('tailwind')) return 'bg-teal-900/30 text-teal-300';
    return 'bg-gray-800 text-gray-300';
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#D1D5DB] font-sans selection:bg-[#3CCF91] selection:text-black">
      <main className="max-w-[768px] mx-auto px-6 pt-24 md:pt-32 pb-32 space-y-24 md:space-y-32">
        
        {/* ── HEADER / INTRO ── */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out flex flex-col items-start w-full space-y-8 md:space-y-10">
          <div className="relative">
            <img
              className="absolute z-0 top-[-10px] md:top-[-15px] left-[-16px] md:left-[-40px] w-[70px] md:w-[150px] opacity-[0.1] filter invert"
              src="https://svgsilh.com/svg/26432.svg"
              alt="Background decoration"
            />
            <p className="relative z-10 text-[#3CCF91] text-[calc(1.5rem+((1vw-7.68px)*1.0416))] font-medium mb-1 tracking-tight">
              Hey there!, I'm-
            </p>
            <h1 className="relative z-10 text-[calc(5rem+((1vw-7.68px)*5.5555))] font-bold text-white tracking-[-1.8px] leading-[0.95]">
              {name}.
            </h1>
          </div>
          
          <h2 className="text-[#8F9094] text-[calc(1.5rem+((1vw-7.68px)*1.0416))] font-medium tracking-[-1.6px] whitespace-pre-wrap max-w-2xl leading-tight">
            <span className="text-white">{title}.</span>{' '}
            A self-taught developer with an interest in Computer Science.
          </h2>

          <div className="text-[#8F9094] text-[calc(1rem+((1vw-7.68px)*0.6944))]">
            <span className="mr-2">🚀</span>
            {bio}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-[#3CCF91] hover:text-black transition-colors rounded-md text-white font-medium text-sm md:text-base">
              <Github className="w-4 h-4 text-[#3CCF91] group-hover:text-black" />
              Github
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-[#3CCF91] hover:text-black transition-colors rounded-md text-white font-medium text-sm md:text-base">
              <Linkedin className="w-4 h-4 text-[#3CCF91] group-hover:text-black" />
              LinkedIn
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-[#3CCF91] hover:text-black transition-colors rounded-md text-white font-medium text-sm md:text-base">
              <Mail className="w-4 h-4 text-[#3CCF91] group-hover:text-black" />
              Email
            </a>
          </div>
        </section>

        {/* ── ABOUT ME ── */}
        {(experience.length > 0 || skills.length > 0) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Ubuntu, sans-serif' }}>
                ⚡ About Me
              </h2>
              <p className="text-[#8F9094] text-[14px] md:text-[16px] whitespace-pre-line leading-relaxed">
                Hey! I'm {name.split(' ')[0]}. I've been passionate about technology and building things since an early age.
                <br /><br />
                {experience.length > 0 && (
                  <>
                    Fast-forward to today, I've had the privilege to work as a{' '}
                    <span className="text-[#3CCF91] cursor-pointer" title={experience[0].description}>
                      {experience[0].role || experience[0].title}
                    </span>{' '}
                    at <span className="text-[#3CCF91] cursor-pointer" title={experience[0].location}>
                      {experience[0].company}
                    </span>.
                  </>
                )}
              </p>
            </div>
            
            {/* Skills as Tags */}
            {skills.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Ubuntu, sans-serif' }}>
                  🔧 Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <span 
                        key={idx} 
                        className={`px-3 py-1 text-sm rounded-md font-medium flex items-center gap-2 ${getTagStyle(skillName)}`}
                      >
                        <Code2 className="w-3 h-3" />
                        {skillName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── FEATURED PROJECTS ── */}
        {projects && projects.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Ubuntu, sans-serif' }}>
              🚀 Featured Projects
            </h2>
            <div className="flex flex-col gap-8">
              {projects.map((project, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#080808] border border-[#333] md:border-[#111] rounded-[10px] overflow-hidden flex flex-col transform hover:scale-[1.01] transition-transform duration-300"
                >
                  <a href={project.liveUrl || project.link || project.githubUrl || '#'} target="_blank" rel="noreferrer" className="block text-center w-full">
                    {/* Project Image */}
                    <div className="min-h-[270px] max-h-[500px] w-full bg-[#111111] relative overflow-hidden shrink-0 rounded-[10px_10px_0_0]">
                      {project.imageUrl || project.image ? (
                        <img 
                          src={project.imageUrl || project.image} 
                          alt={project.name || project.title || 'Project image'} 
                          className="w-full h-full object-cover rounded-[10px_10px_0_0] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8F9094] bg-[#1a1a1a] min-h-[270px]">
                          <span className="text-sm tracking-widest uppercase">Project Preview</span>
                        </div>
                      )}
                    </div>
                  </a>
                  
                  {/* Project Content */}
                  <div className="px-4 py-4 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl text-white font-normal" style={{ fontFamily: 'Ubuntu, sans-serif' }}>
                        {project.name || project.title || 'Untitled Project'}
                      </h3>
                      <div className="flex items-center gap-4">
                        {(project.githubUrl || project.liveUrl || project.link) && (
                          <a 
                            href={project.githubUrl || project.liveUrl || project.link || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-white hover:text-gray-300 transition-colors"
                            aria-label="Link"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Tags / Languages */}
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies || project.techStack || project.tech || (project.language ? [project.language] : [])).slice(0, 4).map((tech, i) => (
                        <span key={i} className={`px-2 py-1 text-xs md:text-sm rounded-md font-medium flex items-center gap-1.5 ${getTagStyle(tech)}`}>
                          <Code2 className="w-3 h-3" />
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="h-px w-full bg-[#333] md:bg-[#111]" />
                    
                    <p className="text-sm md:text-base text-[#8F9094]">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CONTACT ME ── */}
        <section className="flex flex-col items-center justify-center w-full space-y-10 pt-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight">
            Keep In Touch.
          </h2>
          <p className="text-[#8F9094] text-base text-center max-w-lg">
            I'm currently specializing in <span className="text-[#3CCF91]">Front-end Development</span>.
            <br />
            Feel free to get in touch and talk more about your projects.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-[#3CCF91] hover:text-black transition-colors rounded-md text-white font-medium text-sm md:text-base">
              <Linkedin className="w-4 h-4 text-[#3CCF91]" />
              LinkedIn
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-[#3CCF91] hover:text-black transition-colors rounded-md text-white font-medium text-sm md:text-base">
              <Mail className="w-4 h-4 text-[#3CCF91]" />
              Email
            </a>
            <a href={resume} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-[#3CCF91] hover:text-black transition-colors rounded-md text-white font-medium text-sm md:text-base">
              <FileText className="w-4 h-4 text-[#3CCF91]" />
              Resume
            </a>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Minimal_Dark_Fluid;
