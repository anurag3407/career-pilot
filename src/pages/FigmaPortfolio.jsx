import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Figma } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-white/30 border-b border-white/20 dark:bg-black/30 dark:border-white/10">
    <div className="flex items-center gap-2">
      <Figma className="w-6 h-6 text-[#F24E1E]" />
      <span className="font-semibold text-lg">Portfolio</span>
    </div>
    <div className="hidden md:flex gap-6 text-sm font-medium">
      <a href="#about" className="hover:text-primary transition-colors">About</a>
      <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
      <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
      <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
    </div>
    <Link to="/" className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition dark:bg-white dark:text-black dark:hover:bg-gray-200">
      Back to App
    </Link>
  </nav>
);

const ProjectCard = ({ title, description, image, tags, link }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl border border-white/40 p-6 shadow-lg dark:bg-zinc-900/40 dark:border-zinc-800"
  >
    <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map(tag => (
        <span key={tag} className="px-3 py-1 text-xs font-medium bg-white/50 rounded-full border border-white/50 dark:bg-black/50 dark:border-zinc-700">
          {tag}
        </span>
      ))}
    </div>
    <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
      View Project <ExternalLink className="w-4 h-4" />
    </a>
  </motion.div>
);

const SkillBadge = ({ skill }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="px-4 py-2 bg-white/40 backdrop-blur-md border border-white/50 rounded-xl shadow-sm text-sm font-medium dark:bg-zinc-900/40 dark:border-zinc-800"
  >
    {skill}
  </motion.div>
);

const FigmaPortfolio = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 selection:bg-[#18A0FB] selection:text-white font-sans">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] w-64 h-64 bg-orange-400/20 rounded-full blur-[100px]" />
      </div>

      <main className="relative pt-24 px-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.section 
          initial="hidden" animate="visible" variants={containerVariants}
          className="min-h-[80vh] flex flex-col justify-center items-center text-center py-20"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/50 mb-8 backdrop-blur-sm dark:bg-zinc-900/50 dark:border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">Available for work</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Designing digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24E1E] via-[#A259FF] to-[#1ABCFE]">
              experiences
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10">
            I'm a Frontend Developer & UI Designer focusing on building clean, interactive, and user-centric web applications.
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-4">
            <a href="#contact" className="px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Get in touch
            </a>
            <a href="#projects" className="px-8 py-4 bg-white/50 text-black border border-gray-200 rounded-xl font-medium hover:bg-white/80 transition backdrop-blur-sm dark:bg-zinc-900/50 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-800/50">
              View work
            </a>
          </motion.div>
        </motion.section>

        {/* About Section */}
        <section id="about" className="py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl dark:bg-zinc-900/40 dark:border-zinc-800"
          >
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  With a passion for pixels and code, I bridge the gap between design and engineering. I believe in creating interfaces that not only look beautiful but feel intuitive and accessible.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  When I'm not pushing pixels or writing React components, you can find me exploring new design trends, contributing to open source, or sketching out my next big idea on a Figma canvas.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/50 border border-white/50 dark:bg-black/50 dark:border-zinc-800">
                  <h4 className="text-4xl font-bold mb-2">2+</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Years Experience</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/50 border border-white/50 dark:bg-black/50 dark:border-zinc-800">
                  <h4 className="text-4xl font-bold mb-2">20+</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Projects Shipped</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-10">Selected Work</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <ProjectCard 
                title="CareerPilot Dashboard"
                description="A comprehensive career management platform featuring resume building, job tracking, and interview preparation tools."
                image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
                tags={['React', 'Tailwind', 'Framer Motion']}
                link="#"
              />
              <ProjectCard 
                title="Design System"
                description="A scalable component library built for a seamless development experience, inspired by modern design principles."
                image="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
                tags={['Figma', 'UI/UX', 'Storybook']}
                link="#"
              />
              <ProjectCard 
                title="E-Commerce Redesign"
                description="A modern, high-conversion online store redesign focusing on mobile-first experience and fast performance."
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                tags={['Next.js', 'Stripe', 'Zustand']}
                link="#"
              />
              <ProjectCard 
                title="AI Content Generator"
                description="An intuitive interface for an AI-powered content generation tool, featuring real-time preview and collaboration."
                image="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
                tags={['OpenAI', 'React', 'Node.js']}
                link="#"
              />
            </div>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-10">Technical Toolkit</h2>
            <div className="flex flex-wrap gap-4">
              {['React', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'Figma', 'Framer Motion', 'Node.js', 'Next.js', 'Git', 'UI/UX Design', 'Responsive Design', 'Web Accessibility'].map(skill => (
                <SkillBadge key={skill} skill={skill} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center p-12 rounded-[2rem] bg-gradient-to-br from-[#18A0FB]/10 to-[#A259FF]/10 backdrop-blur-xl border border-white/50 dark:border-zinc-800"
          >
            <h2 className="text-4xl font-bold mb-6">Let's create something together.</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
              I'm currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            <a href="mailto:hello@example.com" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition dark:bg-white dark:text-black dark:hover:bg-gray-200">
              <Mail className="w-5 h-5" /> Say Hello
            </a>
            
            <div className="flex justify-center gap-6 mt-12">
              <a href="#" className="p-3 bg-white/50 rounded-full hover:bg-white transition dark:bg-black/50 dark:hover:bg-black border border-transparent hover:border-gray-200 dark:hover:border-zinc-800">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="p-3 bg-white/50 rounded-full hover:bg-white transition dark:bg-black/50 dark:hover:bg-black border border-transparent hover:border-gray-200 dark:hover:border-zinc-800">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="p-3 bg-white/50 rounded-full hover:bg-white transition dark:bg-black/50 dark:hover:bg-black border border-transparent hover:border-gray-200 dark:hover:border-zinc-800">
                <Figma className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default FigmaPortfolio;