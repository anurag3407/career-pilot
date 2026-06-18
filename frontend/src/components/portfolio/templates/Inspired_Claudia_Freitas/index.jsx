import React from 'react';
import dummyData from '../../../../data/dummy_data.json';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Linkedin, Twitter, Calendar, Mail, FileText, Plus } from 'lucide-react';

const InspiredClaudiaFreitas = ({ portfolioData }) => {
  const data = portfolioData || dummyData;
  const { personal, socials, experience, projects, education, skills } = data;

  const currentRole = experience && experience.length > 0 ? experience[0] : null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gray-700">
      <div className="max-w-[900px] mx-auto px-6 py-10 md:py-16">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-20">
          <div className="font-bold text-sm tracking-widest uppercase">
            {personal?.name ? personal.name.replace(/\s+/g, '').toUpperCase() : 'ICFCLAUDIA'}
          </div>
          <nav className="hidden md:flex gap-6 text-xs font-bold tracking-widest uppercase">
            <a href="#about" className="hover:text-gray-300 transition-colors">About</a>
            <a href="#projects" className="hover:text-gray-300 transition-colors">Projects</a>
            <a href="#blog" className="hover:text-gray-300 transition-colors">Blog</a>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border-2 border-transparent"
          >
            <img 
              src={personal?.avatar || 'https://via.placeholder.com/256'} 
              alt={personal?.name || 'Profile'} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="flex-1 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold uppercase tracking-wide"
            >
              {personal?.name || 'Cláudia Freitas'}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-gray-300">
                <Briefcase size={16} />
                <span>{currentRole ? `${currentRole.role} @ ${currentRole.company}` : 'Product Manager'}</span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                {personal?.bio || "With a strong background in digital marketing, agile leadership, and product development, I excel at turning complex ideas into successful products."}
              </p>

              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={16} />
                <span>{personal?.location || 'Porto, Portugal'}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {(skills?.slice(0, 4) || ['Product Management', 'Project Management', 'Marketing', 'Copywriter']).map((skill, idx) => {
                  const skillName = typeof skill === 'string' ? skill : skill.name || 'Skill';
                  return (
                    <span key={idx} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-sm">
                      {skillName}
                    </span>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black font-bold text-xs uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-gray-200 transition-colors"
                >
                  Contact Me
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black font-bold text-xs uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-gray-200 transition-colors"
                >
                  View Resume
                </motion.button>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 text-white">
                {socials?.linkedin && (
                  <motion.a whileHover={{ y: -2 }} href={socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={20} /></motion.a>
                )}
                {socials?.twitter && (
                  <motion.a whileHover={{ y: -2 }} href={socials.twitter} target="_blank" rel="noreferrer"><Twitter size={20} /></motion.a>
                )}
                <motion.a whileHover={{ y: -2 }} href="#" target="_blank" rel="noreferrer"><Calendar size={20} /></motion.a>
                {socials?.email && (
                  <motion.a whileHover={{ y: -2 }} href={`mailto:${socials.email}`} target="_blank" rel="noreferrer"><Mail size={20} /></motion.a>
                )}
                <motion.a whileHover={{ y: -2 }} href="#" target="_blank" rel="noreferrer"><FileText size={20} /></motion.a>
                <div className="flex items-center text-xs font-bold gap-1 cursor-pointer hover:text-gray-300">
                  <Plus size={14} /> more
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-12 text-[15px] text-gray-300 leading-relaxed"
        >
          <section className="space-y-6">
            <p>
              Hi there! I'm {personal?.name?.split(' ')[0] || 'Claudia'}, {currentRole ? `${currentRole.role} at ${currentRole.company}` : 'IT Product Manager at Nordex'}.
            </p>
            <p>
              I am committed to excellence and continuous improvement. I thrive on challenges and deliver high-quality results across e-commerce platforms, e-learning software, streaming services, SaaS, and mobile apps. Here are some of my key accomplishments:
            </p>

            <div className="space-y-6 pt-4">
              {(projects || []).slice(0, 3).map((project, idx) => (
                <div key={idx}>
                  <p className="font-bold text-white mb-1">🏆 {project.title}</p>
                  <p>
                    {project.description} <a href={project.liveUrl || project.githubUrl || '#'} className="underline underline-offset-4 hover:text-white transition-colors" target="_blank" rel="noreferrer">Check project</a>
                  </p>
                </div>
              ))}
              {(!projects || projects.length === 0) && (
                <>
                  <div>
                    <p className="font-bold text-white mb-1">🏆 E-learning (Web + Mobile Apps) for MedFlash</p>
                    <p>Earned a leadership position in medicine e-learning by innovating the UI, introducing media content, and executing a subscription business model, growing users by 140% in 2 years. <a href="#" className="underline underline-offset-4 hover:text-white transition-colors">Check project</a></p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">🏆 Streaming Service (Web + Mobile Apps) for Iupki</p>
                    <p>Reached 20,000 monthly listeners in the first six months by partnering with schools and renowned artists, making it the national leader in media for children. <a href="#" className="underline underline-offset-4 hover:text-white transition-colors">Check project</a></p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">🏆 SaaS E-commerce (Web + Mobile Apps) for Elo Farma Network</p>
                    <p>Achieved an average NPS of 64 while complying with strict pharmaceutical legal frameworks. <a href="#" className="underline underline-offset-4 hover:text-white transition-colors">Check project</a></p>
                  </div>
                </>
              )}
            </div>
            
            <p className="pt-4">
              To get insight into how I can help your business, check out my complete <a href="#projects" className="underline font-bold text-white underline-offset-4">portfolio</a>.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-white tracking-widest uppercase mb-4">Professional Journey</h2>
            <ul className="space-y-2">
              {(experience || []).map((job, idx) => (
                <li key={idx}>
                  - {job.role} at {job.company} · {job.duration || '2 years'}
                </li>
              ))}
              {(!experience || experience.length === 0) && (
                <>
                  <li>- Information Technology Product Manager at Nordex · Ongoing</li>
                  <li>- Senior Product Manager at Plural.com · 2 years</li>
                  <li>- Marketing Project Manager at Josefinas · 1 year</li>
                  <li>- Agile Project Manager for Software Development Projects at BloomIdea · 5 years</li>
                  <li>- Recruiter for Agile Development Teams at BloomIdea · 7 months</li>
                  <li>- Sales Representative for Websites and Mobile Apps Development at BloomIdea · 3 months</li>
                  <li>- Copywriter at C&P Blog · 4 years</li>
                  <li>- Event Staff at Universidade do Minho · 7 months</li>
                  <li>- Sales Representative at Avon · 5 months</li>
                  <li>- Recruiter of Sales Representatives at Avon · 5 months</li>
                </>
              )}
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-white tracking-widest uppercase mb-4">Academic Background</h2>
            <ul className="space-y-2">
              {(education || []).map((edu, idx) => (
                <li key={idx}>
                  - {edu.degree} in {edu.field} at {edu.institution}
                </li>
              ))}
              {(!education || education.length === 0) && (
                <>
                  <li>- B.B.A. in Marketing Research and Innovation Management at the University of Passau, Germany</li>
                  <li>- B.B.A. in Finance, Strategy, and Marketing at the University of Minho, Portugal</li>
                </>
              )}
            </ul>
          </section>

          <section className="pt-4 pb-20">
            <h2 className="font-bold text-white tracking-widest uppercase mb-4">Let's Connect</h2>
            <p>
              Explore my projects and read my articles to see my work in action. Feel free to contact me to discuss potential collaborations or to learn more about my experience and skills. Check out my portfolio or <a href="#" className="underline font-bold text-white underline-offset-4 hover:text-gray-300 transition-colors">book a call</a>.
            </p>
          </section>
          
          {/* Footer Socials */}
          <div className="flex justify-center items-center gap-6 py-10 text-white">
            {socials?.linkedin && (
              <motion.a whileHover={{ y: -2 }} href={socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={20} /></motion.a>
            )}
            {socials?.twitter && (
              <motion.a whileHover={{ y: -2 }} href={socials.twitter} target="_blank" rel="noreferrer"><Twitter size={20} /></motion.a>
            )}
            <motion.a whileHover={{ y: -2 }} href="#" target="_blank" rel="noreferrer"><Calendar size={20} /></motion.a>
            {socials?.email && (
              <motion.a whileHover={{ y: -2 }} href={`mailto:${socials.email}`} target="_blank" rel="noreferrer"><Mail size={20} /></motion.a>
            )}
            <motion.a whileHover={{ y: -2 }} href="#" target="_blank" rel="noreferrer"><FileText size={20} /></motion.a>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default InspiredClaudiaFreitas;
