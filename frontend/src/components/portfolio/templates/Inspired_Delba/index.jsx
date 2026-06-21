import React from 'react';
import dummyData from '../../../../data/dummy_data.json';
import { motion } from 'framer-motion';

const InspiredDelba = ({ portfolioData }) => {
  // Use passed portfolio data, fallback to dummy data if not available
  const data = portfolioData || dummyData;

  const { personal, socials, experience, projects } = data;

  // Staggered animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#111111] font-serif selection:bg-gray-200">
      <div className="max-w-[1000px] mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row gap-16 md:gap-24">
        
        {/* Left Column - Main Content */}
        <div className="flex-1 space-y-20">
          
          {/* Intro Section */}
          <motion.section 
            custom={0} initial="hidden" animate="visible" variants={sectionVariants}
            className="space-y-6"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-gray-900">Portfolio</h1>
            <p className="text-[15.5px] font-medium leading-relaxed text-gray-800 max-w-lg">
              I'm looking for my next role in <strong className="font-bold text-gray-900 border-b-2 border-gray-300 pb-0.5">software engineering</strong> or <strong className="font-bold text-gray-900 border-b-2 border-gray-300 pb-0.5">product development</strong>. If you're hiring:
            </p>
            {socials?.email && (
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${socials.email}`}
                className="inline-block bg-black text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-gray-800 shadow-sm hover:shadow"
              >
                Let's talk
              </motion.a>
            )}
          </motion.section>

          {/* Work / Experience Section */}
          {experience && experience.length > 0 && (
            <motion.section 
              custom={1} initial="hidden" animate="visible" variants={sectionVariants}
              className="space-y-6"
            >
              <h2 className="text-2xl font-serif font-semibold text-gray-900">Work</h2>
              <ul className="space-y-4">
                {experience.map((job, idx) => (
                  <motion.li 
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    key={idx} className="text-[15.5px] font-medium leading-relaxed text-gray-800"
                  >
                    <span className="text-gray-900 font-bold underline decoration-gray-300 decoration-2 underline-offset-4 mr-2 hover:decoration-gray-500 transition-colors cursor-default">
                      {job.company}
                    </span>
                    {job.role} - {job.description}
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Projects / Personal Section */}
          {projects && projects.length > 0 && (
            <motion.section 
              custom={2} initial="hidden" animate="visible" variants={sectionVariants}
              className="space-y-6"
            >
              <h2 className="text-2xl font-serif font-semibold text-gray-900">Personal</h2>
              <ul className="space-y-4">
                {projects.map((project, idx) => (
                  <motion.li 
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    key={idx} className="text-[15.5px] font-medium leading-relaxed text-gray-800"
                  >
                    <a 
                      href={project.liveUrl || project.githubUrl || '#'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-gray-900 font-bold underline decoration-gray-300 decoration-2 underline-offset-4 hover:decoration-gray-600 transition-colors mr-2"
                    >
                      {project.title}
                    </a>
                    {project.description}
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

        </div>

        {/* Right Column - About Me (Sticky) */}
        <div className="md:w-72 lg:w-80 shrink-0">
          <motion.div 
            custom={3} initial="hidden" animate="visible" variants={sectionVariants}
            className="md:sticky md:top-32 space-y-8"
          >
            <section>
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">About me</h2>
              <div className="flex gap-4 items-start">
                <motion.img 
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  src={personal?.avatar || 'https://via.placeholder.com/150'} 
                  alt={personal?.name || 'Profile Avatar'} 
                  className="w-14 h-14 rounded-full object-cover shrink-0 grayscale hover:grayscale-0 shadow-sm border border-gray-100 cursor-pointer"
                />
                <div className="text-[14.5px] font-medium leading-relaxed text-gray-800 space-y-3">
                  <p>
                    Hey, I'm {personal?.name?.split(' ')[0] || 'Delba'}. {personal?.bio || "I build digital experiences and scalable systems."}
                  </p>
                </div>
              </div>
            </section>
            
            <div className="h-[1px] w-full bg-gray-200"></div>

            <section>
              <div className="flex flex-wrap gap-x-5 gap-y-3 text-[13.5px] font-semibold">
                {socials?.linkedin && (
                  <motion.a whileHover={{ y: -2 }} href={socials.linkedin} target="_blank" rel="noreferrer" className="inline-block text-gray-700 hover:text-black underline decoration-gray-300 decoration-2 underline-offset-4 transition-colors">
                    LinkedIn
                  </motion.a>
                )}
                {socials?.youtube && (
                  <motion.a whileHover={{ y: -2 }} href={socials.youtube} target="_blank" rel="noreferrer" className="inline-block text-gray-700 hover:text-black underline decoration-gray-300 decoration-2 underline-offset-4 transition-colors">
                    YouTube
                  </motion.a>
                )}
                {socials?.github && (
                  <motion.a whileHover={{ y: -2 }} href={socials.github} target="_blank" rel="noreferrer" className="inline-block text-gray-700 hover:text-black underline decoration-gray-300 decoration-2 underline-offset-4 transition-colors">
                    GitHub
                  </motion.a>
                )}
                {socials?.twitter && (
                  <motion.a whileHover={{ y: -2 }} href={socials.twitter} target="_blank" rel="noreferrer" className="inline-block text-gray-700 hover:text-black underline decoration-gray-300 decoration-2 underline-offset-4 transition-colors">
                    X
                  </motion.a>
                )}
              </div>
            </section>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default InspiredDelba;
