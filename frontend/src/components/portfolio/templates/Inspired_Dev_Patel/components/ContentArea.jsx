import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

const ContentArea = ({ data, theme, activeTab }) => {
  const { experience, projects, skills, personal, stats } = data || {};

  if (activeTab === 'About') {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="p-10 rounded-[32px] shadow-lg flex-1" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
          
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl md:text-5xl font-bold">
              Hi, I Am <span style={{ color: theme.accent }}>{personal?.name || 'Dev Patel'}</span> <span className="inline-block animate-wave">👋</span>
            </h1>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }}></div>
              Available For Hire
            </div>
          </div>

          <p className="text-lg md:text-xl leading-relaxed max-w-3xl mb-12" style={{ color: theme.textMuted }}>
            {personal?.bio || 'Passionate .NET Developer 🛠️ with hands-on experience in building scalable apps using ASP.NET Core, C#, and SQL. I love turning real-world problems into clean, efficient backend solutions.'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-16">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats?.yearsExperience || '2'}+</div>
              <div className="text-sm md:text-base font-medium" style={{ color: theme.textMuted }}>Year of<br/>Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{(skills?.length || 10)}+</div>
              <div className="text-sm md:text-base font-medium" style={{ color: theme.textMuted }}>Technologies<br/>Mastered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats?.projectsCompleted || '50'}+</div>
              <div className="text-sm md:text-base font-medium" style={{ color: theme.textMuted }}>Successful<br/>Projects</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-8">
            Worked With 50+ Brands ✨ Worldwide | .NET Developer
          </h2>

          {/* Brand/Tech Marquee Fake */}
          <div className="flex gap-4 overflow-hidden">
            {['Visual Studio', '.NET Core', 'API', 'SQL', 'Blazor', 'Docker', 'HTML5', 'JS'].map((tech, idx) => (
              <div key={idx} className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-110" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
                <span className="text-xs font-bold" style={{ color: theme.accent }}>{tech.substring(0, 3)}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Top Bento Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Column in the Right Area */}
        <div className="flex flex-col gap-6">
          
          {/* Work Experience */}
          <div className="p-8 rounded-[32px] shadow-lg" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
            <h2 className="text-2xl font-bold mb-6">Work Experience</h2>
            <div className="flex flex-col gap-6">
              {experience?.length > 0 ? experience.map((exp, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
                    <span className="text-lg font-bold" style={{ color: theme.accent }}>{exp.company?.charAt(0) || 'C'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{exp.role}</h3>
                    <p className="text-sm truncate" style={{ color: theme.textMuted }}>{exp.company}</p>
                  </div>
                  <div className="text-sm font-medium shrink-0" style={{ color: theme.textMuted }}>
                    {exp.startDate ? new Date(exp.startDate).getFullYear() : '2021'} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '2025')}
                  </div>
                </div>
              )) : (
                <>
                  {[
                    { title: 'Freelancer', comp: 'Software Developer', years: '2021-2025' },
                    { title: 'Popway Software', comp: 'Software Developer', years: '2025-2025' },
                    { title: 'Upwork', comp: 'Software Engineer', years: '2021-2025' },
                    { title: 'Visitorz.io', comp: 'Internship', years: '2024-2025' }
                  ].map((exp, idx) => (
                    <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{exp.title}</h3>
                        <p className="text-sm truncate" style={{ color: theme.textMuted }}>{exp.comp}</p>
                      </div>
                      <div className="text-sm font-medium shrink-0" style={{ color: theme.textMuted }}>
                        {exp.years}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* My Expert Area (Skills) */}
          <div className="p-8 rounded-[32px] shadow-lg flex-1" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
            <h2 className="text-2xl font-bold mb-6">My Expert Area</h2>
            <div className="grid grid-cols-3 gap-4">
              {(skills?.length > 0 ? skills.slice(0, 6) : [
                { name: '.Net Core', color: '#6A1B9A' },
                { name: 'JS', color: '#F7DF1E' },
                { name: 'Automation', color: '#AB47BC' },
                { name: 'jQuery', color: '#0277BD' },
                { name: 'API', color: '#4CAF50' },
                { name: 'SQL', color: '#0288D1' }
              ]).map((skill, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-xs rounded-lg" style={{ backgroundColor: skill.color || theme.accent, color: '#fff' }}>
                      {skill.name?.substring(0, 2).toUpperCase() || 'SK'}
                    </div>
                  </div>
                  <span className="text-sm font-medium" style={{ color: theme.textMuted }}>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Recent Projects */}
        <div className="p-8 rounded-[32px] shadow-lg flex flex-col h-full" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <a href="#" className="flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: theme.accent }}>
              All Projects <ArrowRight size={14} />
            </a>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            {(projects?.length > 0 ? projects.slice(0, 2) : [
              { title: 'Shifra, Your Virtual Assistant', category: 'Ai', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop' },
              { title: 'Product Developing', category: 'Web', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop' }
            ]).map((proj, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden cursor-pointer h-48 md:h-64 border" style={{ borderColor: theme.border, backgroundColor: '#0E1018' }}>
                <img src={proj.image || proj.imageUrl} alt={proj.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="self-start px-3 py-1 rounded-lg text-xs font-bold mb-2 shadow-sm" style={{ backgroundColor: '#fff', color: '#000' }}>
                    {proj.category || 'Ai'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContentArea;
