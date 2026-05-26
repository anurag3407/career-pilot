import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Flame,
  Briefcase,
  MapPin,
} from "lucide-react";

import data from "../../../../data/dummy_data.json";

export default function EmberGlow() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-hidden relative font-sans">
      {/* Background Glow Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500/10 blur-3xl rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-500/5 blur-3xl rounded-full"></div>

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Flame className="text-orange-400 w-8 h-8" />
            <span className="uppercase tracking-[0.3em] text-orange-300 text-sm">
              Ember Glow
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 bg-clip-text text-transparent">
            {data.personal.name}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            {data.personal.title}
          </p>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            {data.personal.bio}
          </p>

          <div className="flex justify-center gap-4 mt-10 flex-wrap">
            <a
              href={data.socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-full bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition"
            >
              <Github />
            </a>

            <a
              href={data.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-full bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition"
            >
              <Linkedin />
            </a>

            <a
              href={`mailto:${data.socials.email}`}
              className="p-4 rounded-full bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition"
            >
              <Mail />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src={data.personal.avatar}
              alt={data.personal.name}
              className="w-72 h-72 rounded-3xl object-cover border-4 border-orange-500/30 shadow-2xl shadow-orange-500/20"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6 text-orange-400">
              About Me
            </h2>

            <p className="text-gray-300 leading-relaxed mb-6">
              {data.personal.bio}
            </p>

            <div className="flex items-center gap-2 text-gray-400 mb-8">
              <MapPin className="w-5 h-5 text-orange-400" />
              <span>{data.personal.location}</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-orange-500/10 text-center">
                <h3 className="text-3xl font-bold text-orange-400">
                  {data.stats.yearsExperience}
                </h3>
                <p className="text-sm text-gray-400">Years</p>
              </div>

              <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-orange-500/10 text-center">
                <h3 className="text-3xl font-bold text-orange-400">
                  {data.stats.projectsCompleted}
                </h3>
                <p className="text-sm text-gray-400">Projects</p>
              </div>

              <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-orange-500/10 text-center">
                <h3 className="text-3xl font-bold text-orange-400">
                  {data.stats.happyClients}
                </h3>
                <p className="text-sm text-gray-400">Clients</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SKILLS SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <h2 className="text-4xl font-bold text-center text-orange-400 mb-16">
          Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.skills.map((skill, index) => (
            <div
              key={index}
              className="bg-[#181818] p-6 rounded-2xl border border-orange-500/10"
            >
              <div className="flex justify-between mb-3">
                <span className="font-semibold">{skill.name}</span>
                <span className="text-orange-400">{skill.level}%</span>
              </div>

              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* PROJECTS SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <h2 className="text-4xl font-bold text-center text-orange-400 mb-16">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#181818] rounded-3xl overflow-hidden border border-orange-500/10 hover:border-orange-500/40 transition group"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-orange-300">
                  {project.title}
                </h3>

                <p className="text-gray-400 mb-5 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold hover:opacity-90 transition"
                  >
                    Live
                    <ExternalLink size={18} />
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-500/30 hover:bg-orange-500/10 transition"
                  >
                    Code
                    <Github size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* EXPERIENCE */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto px-6 py-24"
      >
        <h2 className="text-4xl font-bold text-center text-orange-400 mb-16">
          Experience
        </h2>

        <div className="space-y-8">
          {data.experience.map((exp, index) => (
            <div
              key={index}
              className="bg-[#181818] p-8 rounded-3xl border border-orange-500/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-orange-400" />
                <h3 className="text-2xl font-bold">{exp.role}</h3>
              </div>

              <p className="text-orange-300 mb-2">
                {exp.company} • {exp.period}
              </p>

              <p className="text-gray-400 leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <h2 className="text-4xl font-bold text-center text-orange-400 mb-16">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#181818] p-8 rounded-3xl border border-orange-500/10"
            >
              <p className="text-gray-300 italic leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-orange-300">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="border-t border-orange-500/10 py-16 px-6 text-center"
      >
        <h2 className="text-4xl font-bold text-orange-400 mb-6">
          Let's Connect
        </h2>

        <p className="text-gray-400 mb-8">
          Ready to build something amazing together.
        </p>

        <div className="flex justify-center gap-6 mb-10">
          <a
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-400 transition"
          >
            <Github size={28} />
          </a>

          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-400 transition"
          >
            <Linkedin size={28} />
          </a>

          <a
            href={`mailto:${data.socials.email}`}
            className="hover:text-orange-400 transition"
          >
            <Mail size={28} />
          </a>
        </div>

        <p className="text-gray-500 text-sm">
          © 2026 {data.personal.name}. Crafted with Ember Glow.
        </p>
      </motion.footer>
    </div>
  );
}
