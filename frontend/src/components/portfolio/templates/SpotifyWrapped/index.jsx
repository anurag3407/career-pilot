import React from "react";
import data from "../../../../data/dummy_data.json";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Briefcase,
  Star,
} from "lucide-react";

export default function SpotifyWrapped() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white">

      {/* ================= HERO ================= */}
      <section className="snap-start min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-black via-[#0b1f14] to-black">
        <motion.img
          src={data.personal.avatar}
          alt="avatar"
          className="w-32 h-32 rounded-full border-4 border-green-500 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.h1
          className="text-4xl md:text-6xl font-bold text-green-400"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {data.personal.name}
        </motion.h1>

        <p className="text-gray-300 mt-2 text-lg">{data.personal.title}</p>
        <p className="text-gray-500 mt-2 max-w-xl">{data.personal.tagline}</p>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="snap-start min-h-screen flex flex-col justify-center px-8 bg-black">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-green-400 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          Your Year in Dev 🎧
        </motion.h2>

        <p className="text-gray-300 max-w-2xl leading-relaxed">
          {data.personal.bio}
        </p>

        <div className="flex items-center gap-2 mt-6 text-gray-400">
          <MapPin size={18} /> {data.personal.location}
        </div>
      </section>

      {/* ================= SKILLS ================= */}
      <section className="snap-start min-h-screen px-8 flex flex-col justify-center bg-gradient-to-b from-black to-[#06130c]">
        <h2 className="text-4xl font-bold text-green-400 mb-8">
          Top Skills 🔥
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {data.skills.slice(0, 8).map((skill, i) => (
            <motion.div
              key={i}
              className="bg-[#0f0f0f] p-4 rounded-xl border border-green-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between mb-2">
                <span>{skill.name}</span>
                <span className="text-green-400">{skill.level}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      <section className="snap-start min-h-screen px-8 flex flex-col justify-center bg-black">
        <h2 className="text-4xl font-bold text-green-400 mb-8">
          Projects Wrapped 🚀
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {data.projects.map((project, i) => (
            <motion.div
              key={i}
              className="bg-[#111] rounded-xl overflow-hidden border border-green-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <img src={project.image} className="w-full h-48 object-cover" />

              <div className="p-4">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-gray-400 text-sm mt-2">
                  {project.description.slice(0, 120)}...
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="snap-start min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black to-[#06130c]">
        <h2 className="text-4xl font-bold text-green-400 mb-10">
          Your Stats 📊
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Star className="mx-auto text-green-400" size={40} />
            <h3 className="text-3xl font-bold mt-2">
              {data.stats.yearsExperience}
            </h3>
            <p className="text-gray-400">Years Experience</p>
          </div>

          <div>
            <Briefcase className="mx-auto text-green-400" size={40} />
            <h3 className="text-3xl font-bold mt-2">
              {data.stats.projectsCompleted}
            </h3>
            <p className="text-gray-400">Projects Completed</p>
          </div>

          <div>
            <Github className="mx-auto text-green-400" size={40} />
            <h3 className="text-3xl font-bold mt-2">
              {data.stats.happyClients}
            </h3>
            <p className="text-gray-400">Happy Clients</p>
          </div>
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section className="snap-start min-h-screen px-8 flex flex-col justify-center bg-black">
        <h2 className="text-4xl font-bold text-green-400 mb-8">
          Experience Timeline ⏳
        </h2>

        <div className="space-y-6">
          {data.experience.map((exp, i) => (
            <div key={i} className="border-l-2 border-green-500 pl-4">
              <h3 className="text-xl font-bold">{exp.role}</h3>
              <p className="text-green-400">{exp.company}</p>
              <p className="text-gray-500 text-sm">{exp.period}</p>
              <p className="text-gray-400 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="snap-start min-h-screen px-8 flex flex-col justify-center bg-gradient-to-b from-black to-[#06130c]">
        <h2 className="text-4xl font-bold text-green-400 mb-8">
          Loved By Clients ❤️
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {data.testimonials.map((t, i) => (
            <div key={i} className="bg-[#111] p-4 rounded-xl">
              <p className="text-gray-300 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-4">
                <img
                  src={t.avatar}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="snap-start min-h-screen flex flex-col justify-center items-center text-center bg-black px-6">
        <h2 className="text-4xl font-bold text-green-400 mb-4">
          Let's Connect 🎧
        </h2>

        <p className="text-gray-400 mb-6">
          Built with Spotify Wrapped vibes ✨
        </p>

        <div className="flex gap-6 text-green-400">
          <a href={data.socials.github}><Github /></a>
          <a href={data.socials.linkedin}><Linkedin /></a>
          <a href={`mailto:${data.socials.email}`}><Mail /></a>
        </div>
      </section>

    </div>
  );
}