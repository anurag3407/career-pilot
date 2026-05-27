import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MousePointer2, Move, Type, Square, PenTool, Layout, 
  Layers, Hash, Eye, MessageSquare, Briefcase, User, 
  MapPin, Mail, Github, Linkedin, Twitter 
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const Frame = ({ title, children, initialX, initialY, width = 400, isMoveToolActive }) => {
  return (
    <motion.div
      drag={isMoveToolActive}
      dragMomentum={false}
      className={`absolute bg-white shadow-sm border border-gray-200 rounded-sm flex flex-col transition-shadow ${isMoveToolActive ? 'hover:shadow-lg hover:border-blue-400' : ''}`}
      style={{ width, left: initialX, top: initialY }}
      whileDrag={{ scale: 1.02, zIndex: 50, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
    >
      {/* Frame Header (Figma style) */}
      <div className={`flex items-center gap-2 px-2 py-1 bg-transparent text-gray-400 text-xs font-medium font-sans select-none ${isMoveToolActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}>
        <Hash className="w-3 h-3" />
        {title}
      </div>
      {/* Content */}
      <div className="p-6 h-full bg-white relative group overflow-hidden">
        {children}
        {isMoveToolActive && (
           <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 pointer-events-none transition-colors"></div>
        )}
      </div>
    </motion.div>
  );
};

export default function FigmaCanvas() {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [activeTool, setActiveTool] = useState('select'); // 'select' or 'move' (hand tool)

  // Hand tool toggles dragging the whole canvas vs dragging individual frames
  const isHandTool = activeTool === 'move';

  return (
    <div className="h-full w-full bg-[#E5E5E5] overflow-hidden flex flex-col font-sans text-gray-800">
      {/* Toolbar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors">
            <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <span className="font-semibold text-sm tracking-tight text-gray-900">Portfolio.fig</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
          <ToolButton icon={<MousePointer2 className="w-4 h-4" />} active={!isHandTool} onClick={() => setActiveTool('select')} />
          <ToolButton icon={<Move className="w-4 h-4" />} active={isHandTool} onClick={() => setActiveTool('move')} />
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <ToolButton icon={<Square className="w-4 h-4" />} />
          <ToolButton icon={<PenTool className="w-4 h-4" />} />
          <ToolButton icon={<Type className="w-4 h-4" />} />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
            <button className="hover:bg-gray-200 px-1.5 py-0.5 rounded transition-colors" onClick={() => setScale(s => Math.max(0.25, s - 0.25))}>-</button>
            <span className="w-10 text-center">{Math.round(scale * 100)}%</span>
            <button className="hover:bg-gray-200 px-1.5 py-0.5 rounded transition-colors" onClick={() => setScale(s => Math.min(2, s + 0.25))}>+</button>
          </div>
          <button className="bg-[#0D99FF] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors shadow-sm">
            <Eye className="w-3 h-3" /> Preview
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Layers */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col z-40 shrink-0 select-none shadow-[2px_0_8px_rgba(0,0,0,0.02)] hidden md:flex">
          <div className="h-10 border-b border-gray-200 flex items-center px-4 font-semibold text-xs text-gray-800 gap-4">
            <span className="text-black border-b-2 border-black h-full flex items-center pt-0.5">Layers</span>
            <span className="text-gray-400 font-normal">Assets</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 text-xs text-gray-700 font-medium space-y-0.5 custom-scrollbar">
            <LayerItem icon={<Hash className="w-3 h-3" />} text="Hero Section" />
            <LayerItem icon={<Hash className="w-3 h-3" />} text="About Me" />
            <LayerItem icon={<Hash className="w-3 h-3" />} text="Skills" />
            <div className="pl-5 space-y-0.5 mt-0.5 mb-1.5 border-l border-gray-100 ml-3">
               {data.skills.slice(0, 4).map(s => <LayerItem key={s.name} icon={<Type className="w-3 h-3" />} text={s.name} />)}
               <LayerItem icon={<Type className="w-3 h-3" />} text="..." />
            </div>
            <LayerItem icon={<Hash className="w-3 h-3" />} text="Experience" />
            <LayerItem icon={<Hash className="w-3 h-3" />} text="Projects Group" />
            <div className="pl-5 space-y-0.5 mt-0.5 mb-1.5 border-l border-gray-100 ml-3">
               {data.projects.map(p => <LayerItem key={p.title} icon={<Square className="w-3 h-3" />} text={p.title} />)}
            </div>
            <LayerItem icon={<Hash className="w-3 h-3" />} text="Testimonials" />
            <LayerItem icon={<Hash className="w-3 h-3" />} text="Contact & Socials" />
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          ref={canvasRef}
          className="flex-1 overflow-hidden bg-[#F5F5F5] relative select-none"
          style={{ 
             cursor: isHandTool ? 'grab' : 'default'
          }}
        >
          {/* Draggable canvas container (moves when hand tool is active) */}
          <motion.div
            drag={isHandTool}
            dragConstraints={{ top: -2000, left: -2000, right: 2000, bottom: 2000 }}
            dragElastic={0}
            dragMomentum={false}
            className="w-[4000px] h-[4000px] absolute top-[-1500px] left-[-1500px]"
            style={{ 
               scale, 
               transformOrigin: "center center",
               backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
               backgroundSize: '24px 24px',
               backgroundPosition: '0 0'
            }}
            whileTap={isHandTool ? { cursor: "grabbing" } : {}}
          >
            {/* HERO FRAME */}
            <Frame title="Hero Section" initialX={1600} initialY={1600} width={600} isMoveToolActive={!isHandTool}>
               <div className="flex flex-col items-start gap-5">
                 <img src={data.personal.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-md bg-gray-100" onPointerDown={e => e.stopPropagation()} />
                 <div className="space-y-2">
                   <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">{data.personal.name}</h1>
                   <h2 className="text-xl text-[#0D99FF] font-medium">{data.personal.title}</h2>
                 </div>
                 <p className="text-gray-500 max-w-md text-lg leading-relaxed">{data.personal.tagline}</p>
                 <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <MapPin className="w-4 h-4" /> {data.personal.location}
                 </div>
               </div>
            </Frame>

            {/* ABOUT FRAME */}
            <Frame title="About Me" initialX={2250} initialY={1600} width={450} isMoveToolActive={!isHandTool}>
               <h3 className="text-2xl font-bold mb-4 text-gray-900">About</h3>
               <p className="text-gray-600 leading-relaxed text-sm">{data.personal.bio}</p>
               
               <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                 <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{data.stats.yearsExperience}+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Years</div>
                 </div>
                 <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{data.stats.projectsCompleted}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Projects</div>
                 </div>
                 <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{data.stats.happyClients}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Clients</div>
                 </div>
               </div>
            </Frame>

            {/* SKILLS FRAME */}
            <Frame title="Skills" initialX={1600} initialY={2050} width={600} isMoveToolActive={!isHandTool}>
               <h3 className="text-2xl font-bold mb-6 text-gray-900">Skills</h3>
               <div className="flex flex-wrap gap-2.5">
                 {data.skills.map(skill => (
                   <div key={skill.name} className="px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-md text-sm font-semibold text-gray-700">
                     {skill.name}
                   </div>
                 ))}
               </div>
            </Frame>

            {/* EXPERIENCE FRAME */}
            <Frame title="Experience" initialX={2250} initialY={2050} width={450} isMoveToolActive={!isHandTool}>
               <h3 className="text-2xl font-bold mb-6 text-gray-900">Experience</h3>
               <div className="space-y-6">
                 {data.experience.map((exp, i) => (
                   <div key={i} className="relative pl-6 border-l-2 border-[#0D99FF]/30">
                     <div className="absolute w-3 h-3 bg-[#0D99FF] rounded-full -left-[7px] top-1.5 shadow-sm border-2 border-white"></div>
                     <h4 className="text-lg font-bold text-gray-900 leading-tight">{exp.role}</h4>
                     <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 mt-1">
                       <span className="font-semibold text-[#0D99FF]">{exp.company}</span>
                       <span>•</span>
                       <span>{exp.period}</span>
                     </div>
                     <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                   </div>
                 ))}
               </div>
            </Frame>

            {/* PROJECTS SHOWCASE HEADER */}
            <div className="absolute top-[2600px] left-[1600px] text-4xl font-bold text-gray-300 select-none tracking-tight">
              Projects Canvas
            </div>
            
            {/* PROJECTS FRAMES */}
            {data.projects.map((project, idx) => (
              <Frame 
                key={project.title} 
                title={`Project: ${project.title}`} 
                initialX={1600 + (idx % 3) * 450} 
                initialY={2680 + Math.floor(idx / 3) * 480} 
                width={400}
                isMoveToolActive={!isHandTool}
              >
                 <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-5 border border-gray-100 shadow-sm bg-gray-50" onPointerDown={e => e.stopPropagation()} />
                 <h4 className="text-xl font-bold mb-2 text-gray-900">{project.title}</h4>
                 <p className="text-sm text-gray-600 mb-5 line-clamp-3 leading-relaxed">{project.description}</p>
                 <div className="flex flex-wrap gap-2 mb-6">
                   {project.techStack.map(tech => (
                     <span key={tech} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-semibold border border-blue-100">{tech}</span>
                   ))}
                 </div>
                 <div className="flex items-center gap-3 mt-auto">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onPointerDown={e => e.stopPropagation()} className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors shadow-sm cursor-pointer z-50">View Live</a>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onPointerDown={e => e.stopPropagation()} className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer z-50"><Github className="w-4 h-4"/> Source</a>
                 </div>
              </Frame>
            ))}

            {/* TESTIMONIALS FRAME */}
            <Frame title="Testimonials" initialX={2750} initialY={1600} width={450} isMoveToolActive={!isHandTool}>
               <h3 className="text-2xl font-bold mb-6 text-gray-900">What People Say</h3>
               <div className="space-y-5">
                 {data.testimonials.slice(0,2).map((testimonial, i) => (
                   <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <p className="text-sm text-gray-600 italic mb-4">"{testimonial.text}"</p>
                     <div className="flex items-center gap-3">
                       <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" onPointerDown={e => e.stopPropagation()} />
                       <div>
                         <h5 className="text-sm font-bold text-gray-900">{testimonial.name}</h5>
                         <p className="text-xs text-gray-500">{testimonial.role}</p>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </Frame>

            {/* CONTACT & SOCIALS FRAME */}
            <Frame title="Contact & Socials" initialX={2750} initialY={2180} width={450} isMoveToolActive={!isHandTool}>
               <h3 className="text-2xl font-bold mb-4 text-gray-900">Let's Connect</h3>
               <p className="text-sm text-gray-600 mb-6">I'm always open to new opportunities, collaborations, or just a quick chat over coffee.</p>
               <div className="space-y-3">
                 <a href={`mailto:${data.socials.email}`} onPointerDown={e => e.stopPropagation()} className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 rounded-lg border border-gray-100 transition-colors text-sm font-semibold text-gray-700 hover:text-blue-700 cursor-pointer z-50">
                   <Mail className="w-5 h-5" /> {data.socials.email}
                 </a>
                 <a href={data.socials.github} target="_blank" rel="noopener noreferrer" onPointerDown={e => e.stopPropagation()} className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 rounded-lg border border-gray-100 transition-colors text-sm font-semibold text-gray-700 hover:text-blue-700 cursor-pointer z-50">
                   <Github className="w-5 h-5" /> GitHub Profile
                 </a>
                 <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" onPointerDown={e => e.stopPropagation()} className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 rounded-lg border border-gray-100 transition-colors text-sm font-semibold text-gray-700 hover:text-blue-700 cursor-pointer z-50">
                   <Linkedin className="w-5 h-5" /> LinkedIn Profile
                 </a>
                 <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer" onPointerDown={e => e.stopPropagation()} className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 rounded-lg border border-gray-100 transition-colors text-sm font-semibold text-gray-700 hover:text-blue-700 cursor-pointer z-50">
                   <Twitter className="w-5 h-5" /> Twitter Profile
                 </a>
               </div>
            </Frame>

          </motion.div>
        </div>

        {/* Right Sidebar - Properties (Design panel) */}
        <div className="w-64 bg-white border-l border-gray-200 flex flex-col z-40 shrink-0 hidden lg:flex select-none shadow-[-2px_0_8px_rgba(0,0,0,0.02)]">
          <div className="h-10 border-b border-gray-200 flex items-center px-4 font-semibold text-xs text-gray-800 gap-4">
            <span className="text-black border-b-2 border-black h-full flex items-center pt-0.5">Design</span>
            <span className="text-gray-400 font-normal">Prototype</span>
          </div>
          <div className="p-4 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
             {/* Frame Prop */}
             <div>
               <div className="text-xs font-semibold text-gray-900 mb-3 flex justify-between">
                 <span>Frame</span>
               </div>
               <div className="grid grid-cols-2 gap-2 text-xs">
                 <div className="flex items-center gap-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 p-1.5 rounded transition-colors cursor-text">
                   <span className="text-gray-400 w-3">X</span>
                   <span className="font-medium text-gray-700">1600</span>
                 </div>
                 <div className="flex items-center gap-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 p-1.5 rounded transition-colors cursor-text">
                   <span className="text-gray-400 w-3">Y</span>
                   <span className="font-medium text-gray-700">1600</span>
                 </div>
                 <div className="flex items-center gap-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 p-1.5 rounded transition-colors cursor-text">
                   <span className="text-gray-400 w-3">W</span>
                   <span className="font-medium text-gray-700">600</span>
                 </div>
                 <div className="flex items-center gap-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 p-1.5 rounded transition-colors cursor-text">
                   <span className="text-gray-400 w-3">H</span>
                   <span className="font-medium text-gray-700">Mixed</span>
                 </div>
               </div>
             </div>

             <hr className="border-gray-100" />

             {/* Auto Layout */}
             <div>
               <div className="text-xs font-semibold text-gray-900 mb-3 flex justify-between items-center">
                 <span>Auto layout</span>
                 <div className="flex gap-1">
                   <span className="text-gray-400 hover:text-gray-800 cursor-pointer p-0.5">-</span>
                   <span className="text-gray-400 hover:text-gray-800 cursor-pointer p-0.5 text-lg leading-none mt-[-3px]">+</span>
                 </div>
               </div>
               <div className="flex gap-2">
                 <div className="flex-1 bg-white border border-gray-200 hover:border-gray-300 p-1.5 rounded flex justify-center text-gray-600 cursor-pointer shadow-sm">
                    <Move className="w-3.5 h-3.5 rotate-90" />
                 </div>
                 <div className="flex-1 bg-gray-100 border border-gray-200 p-1.5 rounded flex justify-center text-gray-900 cursor-pointer shadow-inner">
                    <Move className="w-3.5 h-3.5" />
                 </div>
               </div>
             </div>

             <hr className="border-gray-100" />

             {/* Fill */}
             <div>
               <div className="text-xs font-semibold text-gray-900 mb-3 flex justify-between items-center">
                 <span>Fill</span>
                 <span className="text-gray-400 hover:text-gray-800 cursor-pointer text-lg leading-none">+</span>
               </div>
               <div className="flex items-center gap-2 group cursor-pointer">
                 <div className="w-4 h-4 rounded-sm border border-gray-200 bg-white shadow-sm group-hover:border-gray-400 transition-colors"></div>
                 <span className="text-xs font-medium text-gray-700 uppercase">FFFFFF</span>
                 <span className="text-xs text-gray-400 ml-auto group-hover:text-gray-700">100%</span>
               </div>
             </div>

             <hr className="border-gray-100" />
             
             {/* Stroke */}
             <div>
               <div className="text-xs font-semibold text-gray-900 mb-3 flex justify-between items-center">
                 <span>Stroke</span>
                 <span className="text-gray-400 hover:text-gray-800 cursor-pointer text-lg leading-none">+</span>
               </div>
               <div className="flex items-center gap-2 group cursor-pointer">
                 <div className="w-4 h-4 rounded-sm border border-gray-200 bg-[#E5E7EB] shadow-sm group-hover:border-gray-400 transition-colors"></div>
                 <span className="text-xs font-medium text-gray-700 uppercase">E5E7EB</span>
                 <span className="text-xs text-gray-400 ml-auto group-hover:text-gray-700">100%</span>
               </div>
             </div>
             
             <hr className="border-gray-100" />
             
             {/* Export */}
             <div>
               <div className="text-xs font-semibold text-gray-900 flex justify-between items-center">
                 <span>Export</span>
                 <span className="text-gray-400 hover:text-gray-800 cursor-pointer text-lg leading-none">+</span>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const ToolButton = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${active ? 'bg-white text-[#0D99FF] shadow-sm ring-1 ring-gray-200/50' : 'hover:bg-gray-200 text-gray-600'}`}
  >
    {icon}
  </button>
);

const LayerItem = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer group transition-colors">
    <div className="text-gray-400 group-hover:text-[#0D99FF] transition-colors">{icon}</div>
    <span className="truncate group-hover:text-gray-900 font-medium">{text}</span>
  </div>
);