import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ExternalLink, Award, BookOpen, Clock, Quote } from 'lucide-react';

export default function SommelierWineCellarRacks() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#1a0b0a] text-[#ebd9c8] font-serif selection:bg-[#722f37] selection:text-[#ebd9c8]">
      {/* Texture overlay for wood/cellar feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

      {/* Navigation / Header - Sommelier Desk */}
      <nav className="relative z-10 border-b border-[#3d1c19] bg-[#140807]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] overflow-hidden p-0.5">
              <img src={data.personal.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#d4af37] uppercase tracking-widest">{data.personal.name}</h1>
              <p className="text-sm text-[#a88a68] italic">{data.personal.title}</p>
            </div>
          </div>
          <div className="flex gap-6 text-[#a88a68]">
            <a href="#cellar" className="hover:text-[#d4af37] transition-colors uppercase tracking-wider text-sm">The Cellar</a>
            <a href="#tasting" className="hover:text-[#d4af37] transition-colors uppercase tracking-wider text-sm">Tasting Notes</a>
            <a href="#vintages" className="hover:text-[#d4af37] transition-colors uppercase tracking-wider text-sm">Vintages</a>
            <a href="#contact" className="hover:text-[#d4af37] transition-colors uppercase tracking-wider text-sm">Contact</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-24 px-6 relative flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <div className="mb-6 flex justify-center text-[#d4af37]">
              <Award className="w-12 h-12 opacity-80" />
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#d4af37] mb-6 leading-tight font-serif drop-shadow-md">
              A Curated Collection of <span className="text-[#ebd9c8]">Digital Experiences</span>.
            </h2>
            <div className="w-24 h-1 bg-[#722f37] mx-auto mb-8 rounded-full"></div>
            <p className="text-lg md:text-xl text-[#a88a68] leading-relaxed mb-10 font-sans font-light">
              {data.personal.bio}
            </p>
            <div className="flex justify-center gap-6">
              {data.socials.github && (
                <a href={data.socials.github} target="_blank" rel="noreferrer" className="text-[#a88a68] hover:text-[#d4af37] transition-all hover:scale-110">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {data.socials.linkedin && (
                <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="text-[#a88a68] hover:text-[#d4af37] transition-all hover:scale-110">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {data.socials.twitter && (
                <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="text-[#a88a68] hover:text-[#d4af37] transition-all hover:scale-110">
                  <Twitter className="w-6 h-6" />
                </a>
              )}
            </div>
          </motion.div>
        </section>

        {/* Projects - The Cellar */}
        <section id="cellar" className="py-24 px-6 bg-[#1f0d0c] border-y border-[#3d1c19] relative shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-[#d4af37] uppercase tracking-widest mb-4">The Cellar</h3>
              <div className="w-16 h-0.5 bg-[#722f37] mx-auto"></div>
              <p className="mt-4 text-[#a88a68] italic font-serif">A showcase of rare and refined projects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 bg-[#140807] rounded-lg border-8 border-[#2c1615] shadow-2xl relative">
              {/* Rack vertical dividers overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(90deg,transparent_32%,#000_33%,transparent_34%,transparent_65%,#000_66%,transparent_67%)]"></div>
              
              {data.projects.map((project, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  {/* The Bottle (Project Card) */}
                  <div className="bg-[#1a0b0a] border border-[#3d1c19] rounded-sm p-6 h-full flex flex-col items-center text-center shadow-lg transform transition-transform group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] relative overflow-hidden z-10">
                    {/* Bottle foil / neck accent */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8a252c] via-[#722f37] to-[#8a252c]"></div>
                    
                    {/* Label border */}
                    <div className="w-full border border-[#d4af37]/30 p-4 mt-4 bg-[#f4eadd] flex-1 flex flex-col justify-center rounded-sm">
                      <div className="border border-[#d4af37]/50 p-4 flex-1 flex flex-col">
                        <span className="text-xs text-[#722f37] uppercase tracking-widest font-bold mb-2">Grand Cru</span>
                        <h4 className="text-xl font-bold text-[#1a0b0a] mb-3 font-serif uppercase leading-tight">{project.title}</h4>
                        <p className="text-sm text-[#4a3530] mb-6 font-sans flex-1 italic">
                          "{project.description}"
                        </p>
                        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                          {project.techStack?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-[10px] text-[#1a0b0a] border border-[#722f37] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-center gap-4 pt-4 border-t border-[#d4af37]/30">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[#1a0b0a] hover:text-[#722f37] transition-colors flex items-center gap-1 text-sm font-semibold uppercase tracking-wider">
                              <ExternalLink className="w-4 h-4" /> Visit
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-[#1a0b0a] hover:text-[#722f37] transition-colors flex items-center gap-1 text-sm font-semibold uppercase tracking-wider">
                              <Github className="w-4 h-4" /> Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills - Tasting Notes */}
        <section id="tasting" className="py-24 px-6 bg-[#140807]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/3 text-center md:text-left">
              <BookOpen className="w-10 h-10 text-[#d4af37] mb-6 mx-auto md:mx-0" />
              <h3 className="text-3xl font-bold text-[#d4af37] uppercase tracking-widest mb-4">Tasting Notes</h3>
              <div className="w-16 h-0.5 bg-[#722f37] mx-auto md:mx-0 mb-6"></div>
              <p className="text-[#a88a68] italic font-serif text-lg leading-relaxed">
                A complex profile with notes of logic, structured design, and a robust finish. Best paired with challenging problems.
              </p>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="bg-[#1a0b0a] border border-[#3d1c19] p-4 rounded-sm flex flex-col items-center justify-center group hover:border-[#d4af37]/50 transition-colors">
                  <span className="text-[#ebd9c8] font-sans font-semibold uppercase tracking-wide text-sm mb-2 group-hover:text-[#d4af37] transition-colors text-center">{skill.name}</span>
                  <div className="w-full bg-[#2c1615] h-1 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#722f37] to-[#d4af37] h-full rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience - Vintages */}
        <section id="vintages" className="py-24 px-6 bg-[#1f0d0c] border-y border-[#3d1c19]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-[#d4af37] uppercase tracking-widest mb-4">Aged Vintages</h3>
              <div className="w-16 h-0.5 bg-[#722f37] mx-auto"></div>
              <p className="mt-4 text-[#a88a68] italic font-serif">Years of maturation in professional cellars.</p>
            </div>

            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#722f37] before:to-transparent">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#d4af37] bg-[#1a0b0a] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(212,175,55,0.2)] z-10 text-[#d4af37]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-sm border border-[#3d1c19] bg-[#140807] shadow-xl hover:border-[#d4af37]/50 transition-colors">
                    <div className="flex flex-col mb-4">
                      <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-1">{exp.period}</span>
                      <h4 className="text-xl font-bold text-[#ebd9c8] font-serif">{exp.role}</h4>
                      <span className="text-[#722f37] font-semibold text-sm uppercase tracking-wider">{exp.company}</span>
                    </div>
                    <p className="text-[#a88a68] font-sans font-light text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials - Critic Reviews */}
        {data.testimonials && data.testimonials.length > 0 && (
          <section className="py-24 px-6 bg-[#140807]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-3xl font-bold text-[#d4af37] uppercase tracking-widest mb-4">Critic Reviews</h3>
                <div className="w-16 h-0.5 bg-[#722f37] mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.testimonials.map((test, idx) => (
                  <div key={idx} className="p-8 border border-[#3d1c19] bg-[#1a0b0a] rounded-sm relative">
                    <Quote className="w-8 h-8 text-[#722f37]/50 absolute top-6 left-6" />
                    <p className="text-[#ebd9c8] italic font-serif leading-relaxed mb-8 relative z-10 pt-4 px-4">
                      "{test.text}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto border-t border-[#3d1c19] pt-6">
                      <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full border border-[#d4af37]" />
                      <div>
                        <h5 className="text-[#d4af37] font-bold font-serif">{test.name}</h5>
                        <span className="text-[#a88a68] text-xs uppercase tracking-wider">{test.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer id="contact" className="py-12 border-t border-[#3d1c19] bg-[#0a0403] text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#d4af37] uppercase tracking-widest font-serif mb-6">Inquire About Services</h2>
          <p className="text-[#a88a68] mb-8 font-sans font-light">
            Available for selected freelance opportunities and collaborations.
          </p>
          <a href={`mailto:${data.socials.email}`} className="inline-flex items-center gap-2 bg-[#1a0b0a] border border-[#d4af37] text-[#d4af37] px-8 py-3 rounded-sm hover:bg-[#d4af37] hover:text-[#1a0b0a] transition-all font-semibold uppercase tracking-widest text-sm mb-12">
            <Mail className="w-4 h-4" /> Contact Sommelier
          </a>
          <p className="text-[#4a3530] text-sm uppercase tracking-widest">
            © {new Date().getFullYear()} {data.personal.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
