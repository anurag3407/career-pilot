import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Calendar, Award, Users, Star, Heart, Sparkles, ArrowRight, MapPin, Phone } from 'lucide-react';

/**
 * Candy Pop Portfolio Template
 * Category: Colorful / Vibrant
 * Description: Candy/bubblegum pastel colors with soft pinks, mints, lavenders, and baby blues. Rounded bubbly shapes, playful sans-serif fonts.
 */
export default function CandyPop() {
  const { portfolioData: data } = usePortfolio();

  const { personal, socials, skills, projects, experience, testimonials, stats } = data;

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const floatAnimation = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseGlow = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-teal-100 font-sans overflow-x-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatAnimation}
          animate="animate"
          className="absolute top-20 left-10 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatAnimation}
          animate="animate"
          transition={{ delay: 0.5 }}
          className="absolute top-40 right-20 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatAnimation}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute bottom-40 left-1/4 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatAnimation}
          animate="animate"
          transition={{ delay: 1.5 }}
          className="absolute bottom-20 right-1/3 w-60 h-60 bg-teal-300/30 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.2, bounce: 0.4 }}
            className="relative inline-block mb-8"
          >
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-1 shadow-2xl relative">
              <motion.div
                variants={pulseGlow}
                animate="animate"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 blur-xl opacity-50"
              />
              <img
                src={personal.avatar}
                alt={personal.name || "Profile Avatar"}
                className="w-full h-full rounded-full object-cover relative z-10"
              />
            </div>
            {/* Decorative circles around avatar */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-pink-300 rounded-full shadow-lg"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-4 -left-4 w-10 h-10 bg-purple-300 rounded-full shadow-lg"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 -right-8 w-8 h-8 bg-blue-300 rounded-full shadow-lg"
            />
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6 leading-tight"
            >
              {personal.name}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-2xl md:text-3xl text-gray-700 mb-6 font-semibold"
            >
              {personal.title}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-2 text-gray-600 mb-8"
            >
              <MapPin size={18} className="text-pink-500" />
              <span>{personal.location}</span>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              {personal.bio}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              {socials.github && (
                <motion.a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                >
                  <Github size={22} />
                  GitHub
                </motion.a>
              )}
              {socials.linkedin && (
                <motion.a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                >
                  <Linkedin size={22} />
                  LinkedIn
                </motion.a>
              )}
              {socials.twitter && (
                <motion.a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                >
                  <Twitter size={22} />
                  Twitter
                </motion.a>
              )}
              {socials.email && (
                <motion.a
                  href={`mailto:${socials.email}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                >
                  <Mail size={22} />
                  Email
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: Calendar, value: stats.yearsExperience, label: "Years Experience", color: "from-pink-300 to-pink-400", textColor: "text-pink-600" },
            { icon: Award, value: stats.projectsCompleted, label: "Projects Completed", color: "from-purple-300 to-purple-400", textColor: "text-purple-600" },
            { icon: Users, value: stats.happyClients, label: "Happy Clients", color: "from-blue-300 to-blue-400", textColor: "text-blue-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stat.color} rounded-3xl p-10 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden`}
            >
              <motion.div
                variants={pulseGlow}
                animate="animate"
                className="absolute inset-0 bg-white/20 blur-2xl"
              />
              <stat.icon size={50} className="mx-auto mb-4 text-white relative z-10" />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.8, delay: index * 0.1 }}
                className="text-5xl font-extrabold text-white mb-2 relative z-10"
              >
                {stat.value}+
              </motion.div>
              <div className="text-white font-semibold text-lg relative z-10">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            My Skills
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-pink-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-xl text-gray-800">{skill.name}</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{skill.level}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full relative"
                  >
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 text-sm font-bold rounded-full shadow-md"
                >
                  {skill.category}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            Featured Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.03, y: -10 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-purple-100"
              >
                <div className="h-56 overflow-hidden relative">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: techIndex * 0.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-sm font-bold rounded-full shadow-md"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={18} />
                        Live Demo
                      </motion.a>
                    )}
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Github size={18} />
                        View Code
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            Work Experience
          </motion.h2>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 relative overflow-hidden"
              >
                <motion.div
                  variants={pulseGlow}
                  animate="animate"
                  className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-2xl opacity-30"
                />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-lg z-10" />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{exp.role}</h3>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 font-bold rounded-full text-sm"
                  >
                    {exp.period}
                  </motion.span>
                </div>
                <div className="text-xl font-bold text-pink-500 mb-4">{exp.company}</div>
                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            What People Say
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-teal-100 relative overflow-hidden"
              >
                <motion.div
                  variants={pulseGlow}
                  animate="animate"
                  className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-blue-300 to-teal-300 rounded-full blur-2xl opacity-30"
                />
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 p-1 shadow-lg"
                  >
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name || "Profile Avatar"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <div className="font-bold text-xl text-gray-800">{testimonial.name}</div>
                    <div className="text-purple-500 font-semibold">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic text-lg leading-relaxed mb-6 relative z-10">"{testimonial.text}"</p>
                <div className="flex gap-1 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star size={20} className="fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            Let's Connect! 🚀
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 mb-12 text-xl leading-relaxed"
          >
            I'm always excited to work on new projects and collaborate with creative people. Let's build something amazing together!
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-center gap-6 mb-16"
          >
            {socials.email && (
              <motion.a
                href={`mailto:${socials.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Mail size={28} />
                Send Email
              </motion.a>
            )}
            {socials.website && (
              <motion.a
                href={socials.website}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <ExternalLink size={28} />
                Visit Website
              </motion.a>
            )}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex justify-center gap-8"
          >
            {socials.github && (
              <motion.a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center text-pink-600 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Github size={32} />
              </motion.a>
            )}
            {socials.linkedin && (
              <motion.a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center text-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Linkedin size={32} />
              </motion.a>
            )}
            {socials.twitter && (
              <motion.a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Twitter size={32} />
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 relative overflow-hidden">
        <motion.div
          variants={floatAnimation}
          animate="animate"
          className="absolute -top-10 -left-10 w-40 h-40 bg-pink-300/40 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatAnimation}
          animate="animate"
          transition={{ delay: 0.5 }}
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300/40 rounded-full blur-3xl"
        />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Heart size={24} className="fill-pink-500 text-pink-500 animate-pulse" />
            <span className="text-gray-700 text-xl font-semibold">Made with love by {personal.name}</span>
            <Sparkles size={24} className="text-purple-500 animate-spin" />
          </motion.div>
          <p className="text-gray-600 text-lg">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
