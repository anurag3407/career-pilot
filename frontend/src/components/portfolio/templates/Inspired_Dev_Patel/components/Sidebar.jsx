import React from 'react';
import { Phone, Copy, Linkedin, Github, MessageCircle } from 'lucide-react';

const Sidebar = ({ data, theme }) => {
  const { personalInfo, contactInfo, socialLinks } = data || {};

  return (
    <div className="rounded-[32px] p-6 shadow-2xl flex flex-col items-center sm:items-start text-center sm:text-left" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
      
      {/* Profile Image Wrapper */}
      <div className="w-full h-64 md:h-72 lg:h-64 rounded-2xl overflow-hidden mb-8 relative group">
        <img 
          src={personalInfo?.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"} 
          alt={personalInfo?.name || "Dev Patel"} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <h1 className="text-3xl font-bold mb-4 flex items-center justify-center sm:justify-start gap-2">
        {personalInfo?.name || 'Dev Patel'} <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
      </h1>
      
      <p className="text-base leading-relaxed mb-8" style={{ color: theme.textMuted }}>
        {personalInfo?.summary || 'A passionate Developer 🛠️ who thrives on crafting robust, high-performance applications. With real-world experience from internships and personal projects, I love turning complex problems into clean, efficient solutions.'}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row w-full gap-4 mb-10">
        <a 
          href={`tel:${contactInfo?.phone || ''}`}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: theme.accent, color: '#fff' }}
        >
          <Phone size={18} />
          Let's Talk
        </a>
        <a 
          href={`mailto:${contactInfo?.email || ''}`}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-colors hover:bg-white/5"
          style={{ border: `1px solid ${theme.border}`, color: theme.textMain }}
        >
          <Copy size={18} />
          Email Me
        </a>
      </div>

      {/* Social Links */}
      <div className="flex gap-3 justify-center sm:justify-start w-full">
        {socialLinks?.linkedin && (
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl transition-colors hover:bg-white/10" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
            <Linkedin size={20} style={{ color: theme.textMuted }} />
          </a>
        )}
        <a href="#" className="p-3 rounded-xl transition-colors hover:bg-white/10" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
          <MessageCircle size={20} style={{ color: theme.textMuted }} />
        </a>
        {socialLinks?.github && (
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl transition-colors hover:bg-white/10" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
            <Github size={20} style={{ color: theme.textMuted }} />
          </a>
        )}
      </div>

      <style jsx>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave {
          animation: wave 2.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
