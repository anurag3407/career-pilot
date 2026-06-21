import { usePortfolio } from "../../../../context/PortfolioContext";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Briefcase,
  MapPin,
} from "lucide-react";


export default function ParallaxMountains() {
  const { portfolioData: data } = usePortfolio();

  const { scrollYProgress } = useScroll();

  const sky = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "linear-gradient(to bottom, #38bdf8, #1e3a8a)",
      "linear-gradient(to bottom, #7c3aed, #312e81)",
      "linear-gradient(to bottom, #020617, #000000)",
    ]
  );

  const mountainBack = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 180]
  );

  const mountainMiddle = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 320]
  );

  const mountainFront = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 480]
  );

  const starsOpacity = useTransform(
    scrollYProgress,
    [0.3, 1],
    [0, 1]
  );

  return (
    <motion.div
      style={{ background: sky }}
      className="relative min-h-screen overflow-hidden text-white"
    >
      {/* SKY + PARALLAX */}
      <motion.div
        style={{ background: sky }}
        className="fixed inset-0 -z-50 overflow-hidden"
      >
        {/* SUN */}
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, 250]),
            opacity: useTransform(
              scrollYProgress,
              [0, 0.6],
              [1, 0]
            ),
          }}
          className="absolute top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-yellow-300 blur-2xl opacity-80"
        />

        {/* MOON */}
        <motion.div
          style={{
            opacity: starsOpacity,
            y: useTransform(
              scrollYProgress,
              [0, 1],
              [100, -50]
            ),
          }}
          className="absolute top-24 right-24 w-28 h-28 rounded-full bg-slate-100 shadow-[0_0_80px_rgba(255,255,255,0.8)]"
        />

        {/* CLOUDS */}
        <motion.div
          style={{
            x: useTransform(scrollYProgress, [0, 1], [0, 200]),
          }}
          className="absolute top-32 left-10 w-72 h-20 bg-white/20 blur-3xl rounded-full"
        />

        <motion.div
          style={{
            x: useTransform(scrollYProgress, [0, 1], [0, -150]),
          }}
          className="absolute top-52 right-20 w-96 h-24 bg-white/10 blur-3xl rounded-full"
        />

        {/* STARS */}
        <motion.div
          style={{ opacity: starsOpacity }}
          className="absolute inset-0"
        >
          {[...Array(80)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 4,
                repeat: Infinity,
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </motion.div>

        {/* BACK MOUNTAINS */}
        <motion.div
          style={{ y: mountainBack }}
          className="absolute bottom-0 left-0 right-0 h-[380px] bg-slate-900"
        >
          <div
            className="w-full h-full"
            style={{
              clipPath:
                "polygon(0 100%,0 55%,15% 40%,30% 60%,50% 25%,70% 55%,85% 35%,100% 60%,100% 100%)",
            }}
          />
        </motion.div>

        {/* MIDDLE MOUNTAINS */}
        <motion.div
          style={{ y: mountainMiddle }}
          className="absolute bottom-0 left-0 right-0 h-[300px] bg-slate-800"
        >
          <div
            className="w-full h-full"
            style={{
              clipPath:
                "polygon(0 100%,0 65%,20% 35%,40% 70%,55% 40%,75% 65%,90% 45%,100% 70%,100% 100%)",
            }}
          />
        </motion.div>

        {/* FRONT MOUNTAINS */}
        <motion.div
          style={{ y: mountainFront }}
          className="absolute bottom-0 left-0 right-0 h-[240px] bg-black"
        >
          <div
            className="w-full h-full"
            style={{
              clipPath:
                "polygon(0 100%,0 75%,10% 55%,25% 80%,45% 50%,65% 85%,80% 60%,100% 80%,100% 100%)",
            }}
          />
        </motion.div>

        {/* FOG */}
        <motion.div
          style={{
            opacity: useTransform(
              scrollYProgress,
              [0, 1],
              [0.2, 0.6]
            ),
          }}
          className="absolute bottom-0 left-0 right-0 h-40 bg-white/10 blur-3xl"
        />
      </motion.div>

      {/* HERO */}
      <section className="relative z-40 min-h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.img
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={data.personal.avatar}
          alt={data.personal.name}
          className="w-40 h-40 rounded-full border-4 border-cyan-400 shadow-2xl shadow-cyan-500/30 object-cover"
        />

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mt-10 text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 bg-clip-text text-transparent"
        >
          {data.personal.name}
        </motion.h1>

        <p className="mt-5 text-2xl text-cyan-100">
          {data.personal.title}
        </p>

        <p className="max-w-2xl mt-6 text-slate-200 leading-relaxed">
          {data.personal.bio}
        </p>

        <div className="flex gap-5 mt-10 flex-wrap justify-center">
          <a
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-full bg-white/10 hover:bg-cyan-500 transition"
          >
            <Github />
          </a>

          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-full bg-white/10 hover:bg-purple-500 transition"
          >
            <Linkedin />
          </a>

          <a
            href={`mailto:${data.socials.email}`}
            className="p-4 rounded-full bg-white/10 hover:bg-pink-500 transition"
          >
            <Mail />
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative z-40 max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/10"
        >
          <h2 className="text-4xl font-bold mb-8 text-cyan-300">
            About
          </h2>

          <p className="text-slate-200 leading-relaxed mb-8">
            {data.personal.bio}
          </p>

          <div className="flex items-center gap-3 text-cyan-200">
            <MapPin />
            <span>{data.personal.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10">
            <div className="bg-cyan-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold">
                {data.stats.yearsExperience}
              </h3>
              <p>Years</p>
            </div>

            <div className="bg-purple-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold">
                {data.stats.projectsCompleted}
              </h3>
              <p>Projects</p>
            </div>

            <div className="bg-pink-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold">
                {data.stats.happyClients}
              </h3>
              <p>Clients</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SKILLS */}
      <section className="relative z-40 max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-cyan-300">
          Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.skills.map((skill, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 rounded-3xl p-6 border border-white/10 backdrop-blur-lg"
            >
              <div className="flex justify-between mb-3">
                <span>{skill.name}</span>
                <span className="text-cyan-300">
                  {skill.level}%
                </span>
              </div>

              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

            {/* PROJECTS */}
      <section className="relative z-40 max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-cyan-300">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.projects.map((project, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -12,
                scale: 1.02,
              }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-lg shadow-xl shadow-cyan-500/10"
            >
              <div className="overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">
                  {project.title}
                </h3>

                <p className="text-slate-200 mb-5 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-sm bg-cyan-500/20 text-cyan-200 border border-cyan-400/20"
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
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-black font-semibold hover:scale-105 transition"
                  >
                    Live
                    <ExternalLink size={18} />
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-400 hover:bg-cyan-400/10 transition"
                  >
                    Code
                    <Github size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="relative z-40 max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-cyan-300">
          Experience
        </h2>

        <div className="space-y-8 relative">
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-cyan-500/30 rounded-full hidden md:block" />

          {data.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative md:ml-12 bg-white/10 rounded-3xl p-8 border border-white/10 backdrop-blur-lg"
            >
              <div className="hidden md:block absolute -left-11 top-10 w-6 h-6 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />

              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-cyan-300" />
                <h3 className="text-2xl font-bold">
                  {exp.role}
                </h3>
              </div>

              <p className="text-purple-300 mb-3">
                {exp.company} • {exp.period}
              </p>

              <p className="text-slate-200 leading-relaxed">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-40 max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-cyan-300">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              whileHover={{
                rotate: 1,
                scale: 1.02,
              }}
              className="bg-white/10 rounded-3xl p-8 border border-white/10 backdrop-blur-lg shadow-lg shadow-purple-500/10"
            >
              <p className="italic text-slate-200 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name || "Profile Avatar"}
                  className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400"
                />

                <div>
                  <h4 className="font-bold">
                    {testimonial.name}
                  </h4>

                  <p className="text-cyan-300 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <footer className="relative z-40 py-24 text-center border-t border-white/10 backdrop-blur-xl bg-black/20">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-6 text-cyan-300"
        >
          Contact
        </motion.h2>

        <p className="text-slate-300 mb-10 max-w-xl mx-auto">
          Let’s create something beautiful together beneath the mountains and stars.
        </p>

        <div className="flex justify-center gap-6">
          <motion.a
            whileHover={{ scale: 1.15 }}
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-full bg-white/10 hover:bg-cyan-500 transition"
          >
            <Github size={30} />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.15 }}
            href={data.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-full bg-white/10 hover:bg-purple-500 transition"
          >
            <Linkedin size={30} />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.15 }}
            href={`mailto:${data.socials.email}`}
            className="p-4 rounded-full bg-white/10 hover:bg-pink-500 transition"
          >
            <Mail size={30} />
          </motion.a>
        </div>

        <p className="text-slate-500 mt-10 text-sm">
          © 2026 {data.personal.name}
        </p>
      </footer>
    </motion.div>
  );
}
  