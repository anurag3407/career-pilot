```jsx
import React from "react";
import data from "../../../../data/dummy_data.json";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Briefcase,
  Code2,
  Quote,
} from "lucide-react";

export default function TronGrid() {
  const {
    personal,
    socials,
    skills,
    projects,
    experience,
    testimonials,
    stats,
  } = data;

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Tron Grid Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black" />

        <div className="absolute bottom-0 left-0 right-0 h-[70vh] perspective-[1200px]">
          <div
            className="w-[200%] h-full absolute left-[-50%]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,255,.25) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,255,.25) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              transform: "rotateX(80deg)",
              transformOrigin: "bottom",
            }}
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12),transparent_60%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="max-w-6xl mx-auto text-center"
          >
            {personal.avatar && (
              <img
                src={personal.avatar}
                alt={personal.name}
                className="w-40 h-40 rounded-full mx-auto mb-8 border-4 border-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.5)] object-cover"
              />
            )}

            <h1 className="text-5xl md:text-7xl font-black mb-4 text-cyan-400 drop-shadow-[0_0_20px_rgba(0,255,255,1)]">
              {personal.name}
            </h1>

            <p className="text-xl md:text-3xl text-gray-300 mb-4">
              {personal.title}
            </p>

            <div className="flex justify-center items-center gap-2 text-gray-400 mb-8">
              <MapPin size={18} />
              <span>{personal.location}</span>
            </div>

            <p className="max-w-3xl mx-auto text-gray-400 mb-10">
              {personal.bio}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                >
                  <Github />
                </a>
              )}

              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                >
                  <Linkedin />
                </a>
              )}

              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                >
                  <Twitter />
                </a>
              )}
            </div>
          </motion.div>
        </section>

        {/* STATS */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Years Experience",
                value: stats?.yearsExperience,
              },
              {
                label: "Projects",
                value: stats?.projectsCompleted,
              },
              {
                label: "Clients",
                value: stats?.happyClients,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur border border-cyan-500/40 rounded-xl p-8 text-center shadow-[0_0_20px_rgba(0,255,255,0.15)]"
              >
                <h3 className="text-4xl font-bold text-cyan-400">
                  {item.value}
                </h3>
                <p className="text-gray-400 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="py-24 px-6">
          <motion.div
            whileInView="visible"
            initial="hidden"
            variants={sectionVariants}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-10 text-cyan-400">
              About Me
            </h2>

            <div className="bg-black/50 backdrop-blur border border-cyan-500/40 rounded-2xl p-8">
              <p className="text-gray-300 leading-relaxed text-lg">
                {personal.bio}
              </p>
            </div>
          </motion.div>
        </section>

        {/* SKILLS */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-cyan-400">
              Skills
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-black/50 border border-cyan-500/40 rounded-xl p-5"
                >
                  <div className="flex justify-between mb-3">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>

                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-cyan-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-cyan-400">
              Projects
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  whileHover={{ y: -10 }}
                  key={index}
                  className="bg-black/60 border border-cyan-500/40 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-52 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.techStack?.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Github />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-cyan-400">
              Experience
            </h2>

            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-black/50 border border-cyan-500/40 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="text-cyan-400" />
                    <h3 className="font-bold text-xl">
                      {exp.role}
                    </h3>
                  </div>

                  <p className="text-cyan-300">
                    {exp.company}
                  </p>

                  <p className="text-gray-500 text-sm mb-4">
                    {exp.period}
                  </p>

                  <p className="text-gray-300">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-cyan-400">
              Testimonials
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-black/50 border border-cyan-500/40 rounded-xl p-8"
                >
                  <Quote className="text-cyan-400 mb-4" />

                  <p className="text-gray-300 mb-5">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-4">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                    )}

                    <div>
                      <h4 className="font-semibold">
                        {testimonial.name}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-cyan-400">
              Contact
            </h2>

            <p className="text-gray-400 mb-10">
              Let's build something amazing together.
            </p>

            <div className="flex justify-center gap-6 flex-wrap">
              {socials.email && (
                <a
                  href={`mailto:${socials.email}`}
                  className="flex items-center gap-2 px-6 py-3 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                >
                  <Mail size={18} />
                  Email
                </a>
              )}

              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                >
                  <Github size={18} />
                  GitHub
                </a>
              )}

              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                >
                  <Linkedin size={18} />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-gray-600">
          <Code2 className="mx-auto mb-2" />
          Built with Tron Grid Theme
        </footer>
      </div>
    </div>
  );
}
```
