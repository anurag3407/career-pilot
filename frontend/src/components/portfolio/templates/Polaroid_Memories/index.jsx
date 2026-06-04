import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, Linkedin, Twitter, Mail, MapPin, 
  ExternalLink, Code2, Briefcase, Award 
} from 'lucide-react';
import defaultData from '../../../../data/dummy_data.json';

/**
 * Stable hash for deterministic randomness (prevents layout shifts on re-renders)
 */
const getHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

/**
 * Returns a stable random number between min and max based on a seed string
 */
const getStableRandom = (seed, min, max) => {
  const hash = Math.abs(getHash(seed));
  return min + (hash % (max - min + 1));
};

export default function PolaroidMemories({ data: propData }) {
  const data = propData || defaultData;

  return (
    <div className="min-h-screen font-sans text-gray-800 relative overflow-hidden bg-[#e0cba8]">
      {/* Dynamic Font Import & CSS Patterns */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
        .font-handwriting { font-family: 'Caveat', cursive; }
        
        .corkboard-pattern {
          background-color: #dcb382;
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23b98c56' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        
        .cork-texture {
           background: radial-gradient(circle, transparent 20%, #dcb382 20%, #dcb382 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #dcb382 20%, #dcb382 80%, transparent 80%, transparent) 25px 25px, linear-gradient(#b98c56 2px, transparent 2px) 0 -1px, linear-gradient(90deg, #b98c56 2px, #dcb382 2px) -1px 0;
           background-size: 50px 50px, 50px 50px, 25px 25px, 25px 25px;
           opacity: 0.05;
           position: fixed;
           inset: 0;
           pointer-events: none;
           z-index: 0;
        }
      `}} />

      <div className="cork-texture" />

      {/* Main Board Container */}
      <main className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-12 pb-24 flex flex-col gap-16 md:gap-24 overflow-x-hidden">
        
        {/* --- Hero Section --- */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-12 mt-8">
          <Polaroid 
            image={data.personal.avatar} 
            caption={data.personal.name}
            rotation={-4}
            delay={0.1}
            isHero
          >
            <div className="flex justify-center gap-3 mt-4 text-gray-500">
              <MapPin size={18} /> <span className="font-medium text-sm">{data.personal.location}</span>
            </div>
          </Polaroid>

          <StickyNote 
            rotation={2} 
            color="bg-yellow-100" 
            delay={0.3} 
            className="max-w-md"
          >
            <h1 className="font-handwriting text-4xl mb-2 font-bold text-gray-800">Hello there! 👋</h1>
            <p className="text-xl font-handwriting text-gray-700 leading-relaxed">
              I'm <strong className="text-gray-900">{data.personal.name}</strong>, a {data.personal.title}.
            </p>
            <div className="w-full h-px bg-gray-300/60 my-3 rounded" />
            <p className="font-medium text-gray-700 leading-relaxed text-[15px]">
              {data.personal.bio}
            </p>
            
            <div className="flex gap-4 mt-6">
              {Object.entries(data.socials).map(([platform, url], idx) => {
                if (!url) return null;
                return (
                  <a key={platform} href={platform === 'email' ? `mailto:${url}` : url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 text-white rounded-full hover:bg-red-500 hover:scale-110 transition-all shadow-md">
                    {platform === 'github' ? <Github size={18}/> : platform === 'linkedin' ? <Linkedin size={18}/> : platform === 'twitter' ? <Twitter size={18}/> : <Mail size={18}/>}
                  </a>
                );
              })}
            </div>
          </StickyNote>
        </section>

        {/* --- Projects Section --- */}
        <section className="mt-8 relative">
          <SectionTitle title="My Captures (Projects)" icon={<Code2 className="inline mr-2 text-red-500" size={28} />} rotation={-2} />
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12 px-4">
            {data.projects.map((project, idx) => {
              const rotation = getStableRandom(project.title, -6, 6);
              
              return (
                <Polaroid 
                  key={project.title}
                  image={project.image}
                  caption={project.title}
                  rotation={rotation}
                  delay={0.1 * (idx % 5)}
                  className="group"
                >
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-white text-center">
                    <p className="text-sm mb-4 font-medium leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {project.techStack.slice(0, 4).map(tech => (
                        <span key={tech} className="text-[11px] bg-white/20 px-2 py-1 rounded-full">{tech}</span>
                      ))}
                      {project.techStack.length > 4 && <span className="text-[11px] bg-white/20 px-2 py-1 rounded-full">+{project.techStack.length - 4}</span>}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-1 transition-transform hover:scale-105">
                          <ExternalLink size={16} /> Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-1 transition-transform hover:scale-105">
                          <Github size={16} /> Code
                        </a>
                      )}
                    </div>
                  </div>
                </Polaroid>
              );
            })}
          </div>
        </section>

        {/* --- Experience & Testimonials (Pinned together) --- */}
        <section className="flex flex-col lg:flex-row gap-12 mt-12">
          
          <div className="flex-1">
            <SectionTitle title="Journey" icon={<Briefcase className="inline mr-2 text-amber-600" size={28} />} rotation={3} />
            <div className="flex flex-col gap-6 mt-10 items-center">
              {data.experience.map((exp, idx) => {
                const rotation = getStableRandom(exp.company, -3, 3);
                return (
                  <StickyNote key={idx} rotation={rotation} color="bg-[#fefce8]" delay={0.1 * idx} className="w-full max-w-lg border border-yellow-200/50">
                    <div className="flex justify-between items-start mb-2 border-b border-yellow-200 pb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{exp.role}</h3>
                        <p className="font-handwriting text-xl text-red-600">{exp.company}</p>
                      </div>
                      <span className="text-xs font-bold bg-yellow-200 text-yellow-800 px-2 py-1 rounded shadow-sm">{exp.period}</span>
                    </div>
                    <p className="text-[14px] text-gray-700 leading-relaxed mt-3">{exp.description}</p>
                  </StickyNote>
                );
              })}
            </div>
          </div>

          <div className="flex-1">
            <SectionTitle title="Memories" icon={<Award className="inline mr-2 text-blue-500" size={28} />} rotation={-2} />
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {data.testimonials.map((test, idx) => {
                const rotation = getStableRandom(test.name, -5, 5);
                const colors = ['bg-pink-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'];
                const color = colors[getStableRandom(test.name, 0, 3)];
                
                return (
                  <StickyNote key={idx} rotation={rotation} color={color} delay={0.15 * idx} pinType="pushpin" className="w-full max-w-sm">
                    <p className="font-handwriting text-2xl leading-tight text-gray-800 mb-4">"{test.text}"</p>
                    <div className="flex items-center gap-3">
                      <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white" />
                      <div>
                        <div className="font-bold text-sm">{test.name}</div>
                        <div className="text-xs text-gray-500">{test.role}</div>
                      </div>
                    </div>
                  </StickyNote>
                );
              })}
            </div>
          </div>

        </section>

        {/* --- Skills Section --- */}
        <section className="mt-8 pb-12 flex flex-col items-center">
          <SectionTitle title="Toolkit" rotation={1} />
          <div className="mt-12 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl max-w-4xl w-full border border-white/50 relative">
            {/* Masking Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/60 shadow-sm rotate-1 backdrop-blur-sm" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/60 shadow-sm -rotate-2 backdrop-blur-sm" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['Frontend', 'Backend', 'Design', 'Tools'].map((category) => {
                const skills = data.skills.filter(s => s.category.toLowerCase().includes(category.toLowerCase()) || 
                  (category === 'Tools' && !['Frontend', 'Backend', 'Design'].some(c => s.category.toLowerCase().includes(c.toLowerCase())))
                );
                
                if(skills.length === 0) return null;

                return (
                  <div key={category} className="mb-4">
                    <h3 className="font-handwriting text-3xl mb-4 text-red-600 border-b-2 border-red-200 pb-1 inline-block">{category}</h3>
                    <div className="flex flex-wrap gap-3">
                      {skills.map(skill => (
                        <div key={skill.name} className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm font-medium shadow-md flex items-center gap-2 hover:bg-red-500 transition-colors cursor-default">
                          {skill.name} 
                          <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">{skill.level}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

// ============================================================================
// UI Components
// ============================================================================

function Polaroid({ image, caption, rotation, delay = 0, isHero = false, className = "", children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: rotation - 15, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, type: 'spring', bounce: 0.4 }}
      whileHover={{ scale: 1.05, zIndex: 40, rotate: rotation > 0 ? rotation + 2 : rotation - 2 }}
      className={`relative bg-[#f9f9f9] p-4 shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all flex-shrink-0 ${isHero ? 'w-80 md:w-96 pb-20' : 'w-72 pb-16'} ${className}`}
    >
      {/* Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/70 shadow-sm rotate-2 backdrop-blur-sm z-20" />
      
      <div className="relative overflow-hidden bg-gray-200 aspect-square shadow-inner w-full">
        <img 
          src={image} 
          alt={caption} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
        />
        {children && (
          <div className="absolute inset-0 z-30">
            {children}
          </div>
        )}
      </div>
      
      {/* Handwritten Caption */}
      <p className={`font-handwriting text-center text-gray-800 absolute bottom-4 left-0 w-full px-4 ${isHero ? 'text-4xl' : 'text-3xl'}`}>
        {caption}
      </p>
    </motion.div>
  );
}

function StickyNote({ children, color = "bg-yellow-100", rotation = 0, delay = 0, pinType = "tape", className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, type: 'spring' }}
      whileHover={{ scale: 1.03, zIndex: 30, y: -5 }}
      className={`relative ${color} p-6 shadow-[2px_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[4px_8px_15px_rgba(0,0,0,0.2)] transition-all ${className}`}
    >
      {/* Fastener */}
      {pinType === 'tape' ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/50 shadow-sm -rotate-2 backdrop-blur-sm z-20" />
      ) : (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_2px_2px_4px_rgba(0,0,0,0.3)] z-20">
          <div className="w-1 h-1 bg-white/50 rounded-full absolute top-1 left-1" />
        </div>
      )}
      
      {/* Note Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Fold Effect (bottom right corner) */}
      <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[20px] border-l-[20px] border-b-transparent border-l-black/5" />
    </motion.div>
  );
}

function SectionTitle({ title, icon, rotation = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex justify-center relative z-20"
    >
      <div 
        className="bg-white/90 backdrop-blur-md px-8 py-3 shadow-[0_5px_15px_rgba(0,0,0,0.1)] inline-block border-2 border-gray-800"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <h2 className="font-handwriting text-4xl text-gray-900 font-bold tracking-wide flex items-center">
          {icon} {title}
        </h2>
      </div>
    </motion.div>
  );
}
