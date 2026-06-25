import React, { useEffect, useMemo, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { Github, Linkedin, Mail, MapPin, MousePointer2, Rocket, Trophy, Zap } from 'lucide-react';

const fallbackData = {
  personal: {
    name: 'Alex Morgan',
    title: 'Interactive Frontend Engineer',
    bio: 'I build playful interfaces, fast product experiences, and memorable web worlds that turn complex ideas into simple interactions.',
    location: 'San Francisco, CA',
    email: 'alex@example.com',
  },
  socials: {
    github: '#',
    linkedin: '#',
  },
  skills: ['React', 'Three.js', 'Node.js', 'Product Design', 'Motion'],
  projects: [
    {
      title: 'Physics Portfolio',
      description: 'A kinetic portfolio world with game-like navigation, collectible case studies, and responsive 3D scenes.',
      technologies: ['React', 'Three.js', 'GSAP'],
      liveUrl: '#',
    },
    {
      title: 'Launch Control',
      description: 'Analytics dashboard for creative teams shipping campaigns with clear milestones and real-time delivery status.',
      technologies: ['Next.js', 'Node.js', 'Postgres'],
      liveUrl: '#',
    },
    {
      title: 'Tiny Game Lab',
      description: 'A set of browser experiments exploring physics, collisions, and delightful onboarding interactions.',
      technologies: ['Canvas', 'TypeScript', 'Vite'],
      liveUrl: '#',
    },
  ],
  experience: [
    {
      title: 'Senior Creative Developer',
      company: 'Playground Studio',
      description: 'Led production of interactive brand experiences and high-performance frontend systems.',
    },
  ],
};

const getSkillName = (skill) => (typeof skill === 'string' ? skill : skill?.name || 'Creative Tech');
const getProjectTitle = (project) => project?.title || project?.name || 'Untitled Project';
const getProjectTech = (project) => project?.technologies || project?.techStack || project?.tech || [];

export default function BrunoSimonPlayground({ portfolioData: propData }) {
  const context = usePortfolio() || {};
  const data = propData || context.portfolioData || fallbackData;
  const personal = data.personal || data.personalInfo || fallbackData.personal;
  const socials = data.socials || {};
  const projects = data.projects?.length ? data.projects : fallbackData.projects;
  const skills = data.skills?.length ? data.skills : fallbackData.skills;
  const experience = data.experience?.length ? data.experience : fallbackData.experience;
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handlePointerMove = (event) => {
      setPointer({
        x: Math.round((event.clientX / window.innerWidth) * 100),
        y: Math.round((event.clientY / window.innerHeight) * 100),
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const stats = useMemo(() => [
    { label: 'Projects', value: `${projects.length}+`, icon: Rocket },
    { label: 'Skills', value: `${skills.length}+`, icon: Zap },
    { label: 'XP Stops', value: `${experience.length}+`, icon: Trophy },
  ], [experience.length, projects.length, skills.length]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7d55a] text-[#171717] selection:bg-[#171717] selection:text-[#f7d55a]">
      <style>{`
        @keyframes bruno-drive { 0%, 100% { transform: translate3d(-10px, 0, 0) rotate(-1deg); } 50% { transform: translate3d(12px, -8px, 0) rotate(1deg); } }
        @keyframes bruno-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes bruno-spin { to { transform: rotate(360deg); } }
        @keyframes bruno-road { to { background-position: 140px 0; } }
        .bruno-card { box-shadow: 10px 10px 0 #171717; }
        .bruno-road { animation: bruno-road 1.25s linear infinite; }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,0.55), transparent 20rem), radial-gradient(circle at 20% 15%, rgba(255,111,66,0.5), transparent 18rem), radial-gradient(circle at 85% 70%, rgba(76,104,255,0.45), transparent 20rem)`,
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <a href="#top" className="rounded-full border-4 border-[#171717] bg-white px-5 py-2 font-black uppercase tracking-tight bruno-card">
          {personal.name || fallbackData.personal.name}
        </a>
        <nav className="hidden items-center gap-2 md:flex">
          {['garage', 'missions', 'skills', 'contact'].map((item) => (
            <a key={item} href={`#${item}`} className="rounded-full border-2 border-[#171717] bg-white/70 px-4 py-2 text-sm font-black uppercase hover:bg-[#ff6f42] hover:text-white">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <section className="grid min-h-[720px] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border-4 border-[#171717] bg-white px-4 py-2 font-black uppercase bruno-card">
              <MousePointer2 className="h-4 w-4" /> Move around the playground
            </div>
            <h1 className="max-w-4xl text-[clamp(4rem,13vw,11rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
              {personal.name || fallbackData.personal.name}
            </h1>
            <p className="mt-7 max-w-2xl rounded-[2rem] border-4 border-[#171717] bg-white p-6 text-xl font-bold leading-relaxed bruno-card md:text-2xl">
              {personal.title || fallbackData.personal.title} building interactive portfolios with game-feel, motion, and a little chaos.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#missions" className="rounded-full border-4 border-[#171717] bg-[#ff6f42] px-7 py-4 font-black uppercase text-white bruno-card transition hover:-translate-y-1">
                Start Engine
              </a>
              <a href={`mailto:${personal.email || ''}`} className="rounded-full border-4 border-[#171717] bg-white px-7 py-4 font-black uppercase bruno-card transition hover:-translate-y-1">
                Say Hello
              </a>
            </div>
          </div>

          <div className="relative min-h-[520px]">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#171717] bg-[#4c68ff] bruno-card md:h-96 md:w-96" style={{ animation: 'bruno-bob 4s ease-in-out infinite' }} />
            <div className="absolute inset-x-0 bottom-20 h-20 rounded-full border-4 border-[#171717] bg-[linear-gradient(90deg,#171717_0_20px,transparent_20px_70px)] bg-[length:140px_100%] bruno-road" />
            <div className="absolute bottom-28 left-1/2 w-[330px] -translate-x-1/2 md:w-[460px]" style={{ animation: 'bruno-drive 3s ease-in-out infinite' }}>
              <div className="relative h-44 rounded-[3rem] border-4 border-[#171717] bg-[#ff6f42] bruno-card">
                <div className="absolute left-16 top-[-54px] h-24 w-48 rounded-t-[4rem] border-4 border-b-0 border-[#171717] bg-white md:left-24 md:w-64" />
                <div className="absolute left-24 top-[-30px] h-14 w-20 rounded-t-[2rem] border-4 border-[#171717] bg-[#8ed7ff] md:left-36" />
                <div className="absolute right-14 top-[-30px] h-14 w-20 rounded-t-[2rem] border-4 border-[#171717] bg-[#8ed7ff]" />
                <div className="absolute -left-8 top-16 h-16 w-16 rounded-full border-4 border-[#171717] bg-white" />
                <div className="absolute -right-8 top-16 h-16 w-16 rounded-full border-4 border-[#171717] bg-white" />
                <div className="absolute bottom-[-38px] left-16 h-24 w-24 rounded-full border-8 border-[#171717] bg-white" style={{ animation: 'bruno-spin 1s linear infinite' }} />
                <div className="absolute bottom-[-38px] right-16 h-24 w-24 rounded-full border-8 border-[#171717] bg-white" style={{ animation: 'bruno-spin 1s linear infinite' }} />
                <div className="absolute bottom-[-10px] left-0 right-0 mx-auto h-10 w-32 rounded-t-full border-4 border-[#171717] bg-[#171717]" />
              </div>
            </div>
          </div>
        </section>

        <section id="garage" className="grid gap-5 py-12 md:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-[2rem] border-4 border-[#171717] bg-white p-7 bruno-card">
              <Icon className="mb-6 h-9 w-9" />
              <div className="text-6xl font-black tracking-[-0.08em]">{value}</div>
              <div className="mt-2 font-black uppercase tracking-widest text-[#4c68ff]">{label}</div>
            </div>
          ))}
        </section>

        <section id="missions" className="py-16">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-black uppercase tracking-[0.3em] text-[#4c68ff]">Project Missions</p>
              <h2 className="text-5xl font-black uppercase tracking-[-0.06em] md:text-7xl">Pick a checkpoint</h2>
            </div>
            <p className="max-w-xl rounded-3xl border-4 border-[#171717] bg-white p-5 font-bold bruno-card">{personal.bio || fallbackData.personal.bio}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.slice(0, 6).map((project, index) => (
              <a key={getProjectTitle(project)} href={project.liveUrl || project.link || project.githubUrl || '#'} className="group rounded-[2rem] border-4 border-[#171717] bg-white p-6 bruno-card transition hover:-translate-y-2">
                <div className="mb-8 flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border-4 border-[#171717] bg-[#f7d55a] text-2xl font-black">{index + 1}</span>
                  <span className="rounded-full border-2 border-[#171717] bg-[#ff6f42] px-3 py-1 text-xs font-black uppercase text-white">Mission</span>
                </div>
                <h3 className="text-3xl font-black uppercase leading-none tracking-[-0.04em]">{getProjectTitle(project)}</h3>
                <p className="mt-4 min-h-24 font-bold text-[#3b3b3b]">{project.description || 'A playful portfolio checkpoint with polished interactions.'}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {getProjectTech(project).slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded-full border-2 border-[#171717] bg-[#8ed7ff] px-3 py-1 text-xs font-black uppercase">{tech}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="skills" className="grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border-4 border-[#171717] bg-[#4c68ff] p-8 text-white bruno-card">
            <h2 className="text-5xl font-black uppercase leading-none tracking-[-0.05em]">Toolbox unlocked</h2>
            <p className="mt-6 font-bold text-white/85">A bright, arcade-like skill board inspired by interactive web playgrounds.</p>
          </div>
          <div className="flex flex-wrap content-start gap-4">
            {skills.map((skill, index) => (
              <span key={`${getSkillName(skill)}-${index}`} className="rounded-[1.25rem] border-4 border-[#171717] bg-white px-5 py-4 text-xl font-black uppercase bruno-card transition hover:rotate-2 hover:bg-[#ff6f42] hover:text-white">
                {getSkillName(skill)}
              </span>
            ))}
          </div>
        </section>

        <section id="contact" className="rounded-[2.5rem] border-4 border-[#171717] bg-white p-8 bruno-card md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 flex items-center gap-2 font-black uppercase tracking-[0.25em] text-[#ff6f42]"><MapPin className="h-4 w-4" /> {personal.location || 'Available worldwide'}</p>
              <h2 className="text-5xl font-black uppercase leading-none tracking-[-0.06em] md:text-7xl">Ready for the next lap?</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={socials.github || '#'} className="rounded-full border-4 border-[#171717] bg-[#171717] p-4 text-white transition hover:-translate-y-1" aria-label="GitHub"><Github /></a>
              <a href={socials.linkedin || '#'} className="rounded-full border-4 border-[#171717] bg-[#4c68ff] p-4 text-white transition hover:-translate-y-1" aria-label="LinkedIn"><Linkedin /></a>
              <a href={`mailto:${personal.email || ''}`} className="rounded-full border-4 border-[#171717] bg-[#ff6f42] p-4 text-white transition hover:-translate-y-1" aria-label="Email"><Mail /></a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
