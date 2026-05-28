import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, MessageCircle, User, ChevronDown, 
  Share, MoreHorizontal, ArrowUpRight, Github, 
  Linkedin, Twitter, Mail, MapPin, Briefcase, 
  ExternalLink, Calendar, Star, TrendingUp
} from 'lucide-react';
import defaultData from '../../../../data/dummy_data.json';

// Hook to determine number of columns based on screen width
function useColumns() {
  const [cols, setCols] = useState(5);
  
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1280) setCols(5);
      else if (window.innerWidth >= 1024) setCols(4);
      else if (window.innerWidth >= 768) setCols(3);
      else if (window.innerWidth >= 640) setCols(2);
      else setCols(1);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);
  
  return cols;
}

/**
 * Pinterest Masonry Portfolio Template
 * Category: Famous UI Inspired
 * Description: Pinterest-style masonry grid layout with varied-height cards. Infinite scroll simulation and pin-style project cards.
 */
export default function PinterestMasonry({ data: propData }) {
  const data = propData || defaultData;
  const [activeCategory, setActiveCategory] = useState('All Pins');

  // Format skills into categories
  const skillCategories = [...new Set(data.skills.map(s => s.category))];

  // Combine all portfolio data into a single array of "Pins"
  const allPins = [
    { type: 'profile', id: 'profile-1', ...data.personal, stats: data.stats },
    { type: 'contact', id: 'contact-1', socials: data.socials },
    ...data.projects.map(p => ({ type: 'project', ...p, id: `project-${p.id || p.title}` })),
    ...data.experience.map(e => ({ type: 'experience', ...e, id: `exp-${e.id || e.role}` })),
    ...data.testimonials.map(t => ({ type: 'testimonial', ...t, id: `test-${t.id || t.name}` })),
    ...skillCategories.map((cat, idx) => ({
      type: 'skill',
      id: `skill-${idx}`,
      category: cat,
      skills: data.skills.filter(s => s.category === cat)
    }))
  ];

  // Optional: Shuffle or organize pins for a more organic Pinterest look.
  // We'll keep a predictable order but rely on CSS columns for masonry.
  // Profile should always be first.
  const profilePin = allPins.find(p => p.type === 'profile');
  const restPins = allPins.filter(p => p.type !== 'profile');
  
  // Stably sort based on a deterministic hash of the ID to avoid layout shifts on state changes
  const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };
  
  // Mix them up slightly in a completely stable, reproducible order
  const sortedPins = [profilePin, ...[...restPins].sort((a, b) => getHash(a.id) - getHash(b.id))];

  // Filter based on category
  const filteredPins = sortedPins.filter(pin => {
    if (activeCategory === 'All Pins') return true;
    if (activeCategory === 'Projects' && pin.type === 'project') return true;
    if (activeCategory === 'Experience' && pin.type === 'experience') return true;
    if (activeCategory === 'Skills' && pin.type === 'skill') return true;
    if (activeCategory === 'Testimonials' && pin.type === 'testimonial') return true;
    if (pin.type === 'profile') return true; // Always show profile
    return false;
  });

  const categories = ['All Pins', 'Projects', 'Experience', 'Skills', 'Testimonials'];

  // Distribute pins into columns round-robin style
  const numColumns = useColumns();
  const columns = Array.from({ length: numColumns }, () => []);
  filteredPins.forEach((pin, index) => {
    columns[index % numColumns].push(pin);
  });

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#e60023]/20">
      
      {/* Top Navbar */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 px-4 h-[80px] flex items-center justify-between gap-2 md:gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        {/* Logo / Home */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer text-[#e60023]">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345l-.288 1.178c-.046.19-.152.232-.344.143-1.282-.598-2.083-2.476-2.083-3.984 0-3.238 2.355-6.216 6.786-6.216 3.565 0 6.337 2.54 6.337 5.927 0 3.543-2.234 6.394-5.335 6.394-1.042 0-2.023-.542-2.357-1.18l-.64 2.438c-.231.884-.858 1.99-1.28 2.665 1.002.308 2.066.474 3.155.474 6.621 0 11.988-5.368 11.988-11.988C24 5.367 18.638 0 12.017 0z"/></svg>
          </div>
          <button className="hidden md:block px-4 py-3 bg-[#111111] text-white rounded-full font-semibold text-[15px]">Home</button>
          <button className="hidden md:flex px-4 py-3 hover:bg-gray-100 rounded-full font-semibold text-[15px] items-center gap-1">Create <ChevronDown size={20}/></button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-[1000px]">
          <div className="bg-[#e9e9e9] hover:bg-[#e1e1e1] flex items-center px-4 py-3 rounded-full transition-colors">
            <Search size={20} className="text-[#767676] mr-3" />
            <input 
              type="text" 
              placeholder="Search for projects, skills, or experience..." 
              className="bg-transparent border-none outline-none w-full text-[15px] placeholder:text-[#767676]"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer text-[#767676]">
            <Bell size={24} />
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer text-[#767676]">
            <MessageCircle size={24} />
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer">
            <img src={data.personal.avatar} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-[100px] pb-24 px-4 md:px-8 max-w-[2000px] mx-auto">
        
        {/* Category Filters */}
        <div className="flex justify-center mb-8 overflow-x-auto hide-scrollbar py-2">
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-semibold text-[15px] transition-colors whitespace-nowrap ${
                  activeCategory === category 
                    ? 'bg-[#111111] text-white' 
                    : 'bg-white hover:bg-gray-100 text-[#111111]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* JS-based Masonry Grid */}
        <div className="flex gap-6 w-full items-start mx-auto">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex-1 flex flex-col gap-6 min-w-0">
              <AnimatePresence mode="popLayout">
                {col.map((pin, index) => (
                  <motion.div
                    key={pin.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                    className="w-full"
                  >
                    <PinRenderer pin={pin} data={data} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

// ---------------------------------------------------------
// Pin Dispatcher
// ---------------------------------------------------------
function PinRenderer({ pin, data }) {
  switch (pin.type) {
    case 'profile': return <ProfilePin pin={pin} />;
    case 'project': return <ProjectPin pin={pin} data={data} />;
    case 'experience': return <ExperiencePin pin={pin} />;
    case 'testimonial': return <TestimonialPin pin={pin} />;
    case 'skill': return <SkillPin pin={pin} />;
    case 'contact': return <ContactPin pin={pin} />;
    default: return null;
  }
}

// ---------------------------------------------------------
// Individual Pin Components
// ---------------------------------------------------------

function ProfilePin({ pin }) {
  return (
    <div className="bg-[#f0f0f0] rounded-3xl p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
      {/* Decorative blurred background */}
      <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
        <img src={pin.avatar} alt="blur" className="w-full h-full object-cover blur-2xl scale-150" />
      </div>
      
      <div className="relative z-10">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-6 mx-auto border-4 border-white shadow-lg">
          <img src={pin.avatar} alt={pin.name} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{pin.name}</h1>
        <p className="text-[#767676] mb-4 font-medium">{pin.title}</p>
        
        <div className="flex items-center justify-center gap-1 text-[15px] mb-6">
          <MapPin size={16} /> {pin.location}
        </div>
        
        <p className="text-[15px] leading-relaxed mb-8">
          {pin.bio}
        </p>

        <div className="flex gap-4 w-full">
          <button className="flex-1 py-3 bg-[#e60023] hover:bg-[#b50019] text-white rounded-full font-bold transition-colors">
            Follow
          </button>
          <button className="flex-1 py-3 bg-[#e9e9e9] hover:bg-[#e1e1e1] rounded-full font-bold transition-colors">
            Message
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-between w-full mt-8 pt-6 border-t border-gray-300">
          <div className="text-center">
            <div className="font-bold text-xl">{pin.stats.yearsExperience}+</div>
            <div className="text-xs text-[#767676] uppercase tracking-wider font-semibold">Years Exp</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl">{pin.stats.projectsCompleted}</div>
            <div className="text-xs text-[#767676] uppercase tracking-wider font-semibold">Projects</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl">{pin.stats.happyClients}</div>
            <div className="text-xs text-[#767676] uppercase tracking-wider font-semibold">Clients</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectPin({ pin, data }) {
  // Stably decide aspect ratio based on deterministic pin ID to avoid random layout changes on hover/render
  const isImageTall = pin.id.charCodeAt(pin.id.length - 1) % 2 === 0;

  return (
    <div className="flex flex-col cursor-zoom-in group">
      <div className="relative rounded-2xl overflow-hidden mb-2 shadow-sm bg-gray-100">
        <img 
          src={pin.image} 
          alt={pin.title} 
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isImageTall ? 'aspect-[3/4]' : 'aspect-square'}`}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          <div className="flex justify-end">
            <button className="bg-[#e60023] hover:bg-[#b50019] text-white font-bold px-4 py-3 rounded-full shadow-md text-[15px] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              Save
            </button>
          </div>
          <div className="flex justify-between gap-2 items-end">
            {pin.liveUrl && (
              <a href={pin.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1 bg-white/90 hover:bg-white text-black font-semibold px-3 py-2 rounded-full text-[13px] backdrop-blur-sm truncate max-w-[150px] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                <ArrowUpRight size={16} /> {pin.liveUrl.replace(/^https?:\/\//, '')}
              </a>
            )}
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-black backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                <Share size={18} />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-black backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-1 flex gap-2 mt-1">
        <div className="flex flex-col">
          <h3 className="font-bold text-[15px] leading-snug">{pin.title}</h3>
          <p className="text-[13px] text-[#767676] line-clamp-2 mt-0.5">{pin.description}</p>
        </div>
      </div>
      
      {/* Tiny Author attribution */}
      <div className="flex items-center gap-2 mt-2 px-1">
        <img src={data.personal.avatar} alt="author" className="w-5 h-5 rounded-full object-cover" />
        <span className="text-[13px] text-[#111111] font-medium">{data.personal.name}</span>
      </div>
    </div>
  );
}

function ExperiencePin({ pin }) {
  return (
    <div className="bg-[#fff3cd] rounded-3xl p-6 shadow-sm group hover:shadow-md transition-shadow cursor-pointer">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 text-amber-600 group-hover:rotate-6 transition-transform">
        <Briefcase size={24} />
      </div>
      <h3 className="font-bold text-xl mb-1">{pin.role}</h3>
      <div className="font-semibold text-[#111111] mb-2">{pin.company}</div>
      <div className="text-sm font-medium text-amber-800 bg-amber-100 w-fit px-3 py-1 rounded-full mb-4 flex items-center gap-1.5">
        <Calendar size={14} /> {pin.period}
      </div>
      <p className="text-[15px] leading-relaxed text-gray-800">
        {pin.description}
      </p>
    </div>
  );
}

function TestimonialPin({ pin }) {
  return (
    <div className="bg-[#e9f5ff] rounded-3xl p-6 shadow-sm group hover:shadow-md transition-shadow">
      <div className="text-blue-400 mb-4 opacity-50">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
      </div>
      <p className="text-[16px] leading-relaxed italic text-gray-800 mb-6 font-medium">
        "{pin.text}"
      </p>
      <div className="flex items-center gap-3">
        <img src={pin.avatar} alt={pin.name} className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-110 transition-transform" />
        <div>
          <div className="font-bold text-[15px]">{pin.name}</div>
          <div className="text-[13px] text-gray-600">{pin.role}</div>
        </div>
      </div>
    </div>
  );
}

function SkillPin({ pin }) {
  return (
    <div className="bg-gray-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg">{pin.category}</h3>
        <TrendingUp size={20} className="text-[#e60023]" />
      </div>
      
      <div className="flex flex-col gap-4">
        {pin.skills.map(skill => (
          <div key={skill.name}>
            <div className="flex justify-between text-[14px] font-semibold mb-1">
              <span>{skill.name}</span>
              <span>{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div 
                className="bg-[#111111] h-2 rounded-full" 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPin({ pin }) {
  return (
    <div className="bg-[#111111] text-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-[#e60023] rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
        <Star size={32} />
      </div>
      <h3 className="font-bold text-2xl mb-2">Let's Connect</h3>
      <p className="text-gray-400 text-[15px] mb-6">Always open to discussing product design work or partnership opportunities.</p>
      
      <div className="flex gap-3 mb-2 w-full">
        {pin.socials.github && (
          <a href={pin.socials.github} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl flex justify-center transition-colors">
            <Github size={20} />
          </a>
        )}
        {pin.socials.linkedin && (
          <a href={pin.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl flex justify-center transition-colors">
            <Linkedin size={20} />
          </a>
        )}
        {pin.socials.twitter && (
          <a href={pin.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl flex justify-center transition-colors">
            <Twitter size={20} />
          </a>
        )}
      </div>
      
      <a href={`mailto:${pin.socials.email}`} className="w-full py-3 bg-white hover:bg-gray-200 text-black rounded-xl font-bold transition-colors mt-2 text-[15px]">
        Email Me
      </a>
    </div>
  );
}
