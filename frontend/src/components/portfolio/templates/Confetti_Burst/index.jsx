import { usePortfolio } from "../../../../context/PortfolioContext";
import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Briefcase,
  MapPin,
  Sparkles,
} from "lucide-react";


const confettiColors = [
  "bg-pink-500",
  "bg-yellow-400",
  "bg-cyan-400",
  "bg-green-400",
  "bg-purple-500",
  "bg-orange-400",
];

export default function ConfettiBurst() {
  const { portfolioData: data } = usePortfolio();

  const [bursts, setBursts] = React.useState([]);

  const createBurst = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const newBurst = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setBursts((prev) => [...prev, newBurst]);

    setTimeout(() => {
      setBursts((prev) =>
        prev.filter((burst) => burst.id !== newBurst.id)
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-pink-950 via-purple-950 to-indigo-950 text-white relative">
      
      {/* CLICK BURST CONFETTI */}
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="pointer-events-none fixed inset-0 z-50"
        >
          {[...Array(24)].map((_, i) => {
            const angle = (360 / 24) * i;
            const distance = 80 + Math.random() * 80;

            return (
              <motion.div
                key={i}
                initial={{
                  x: burst.x,
                  y: burst.y,
                  scale: 1,
                  opacity: 1,
                }}
                animate={{
                  x:
                    burst.x +
                    Math.cos((angle * Math.PI) / 180) * distance,
                  y:
                    burst.y +
                    Math.sin((angle * Math.PI) / 180) * distance,
                  rotate: 360,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                }}
                className={`absolute w-3 h-3 rounded-sm ${
                  confettiColors[i % confettiColors.length]
                }`}
              />
            );
          })}
        </div>
      ))}

      {/* FLOATING CONFETTI */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: -100,
              x: Math.random() * 1500,
              rotate: 0,
              opacity: 0.8,
            }}
            animate={{
              y: "120vh",
              rotate: 360,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            className={`absolute w-3 h-3 rounded-sm ${
              confettiColors[i % confettiColors.length]
            }`}
          />
        ))}
      </div>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <img
            src={data.personal.avatar}
            alt={data.personal.name}
            className="w-40 h-40 rounded-full border-4 border-pink-400 object-cover shadow-2xl shadow-pink-500/40"
          />

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute -top-3 -right-3 bg-yellow-400 p-3 rounded-full text-black"
          >
            <Sparkles />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-10 text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent"
        >
          {data.personal.name}
        </motion.h1>

        <p className="text-2xl text-pink-200 mt-5">
          {data.personal.title}
        </p>

        <p className="max-w-2xl text-gray-300 mt-6 leading-relaxed">
          {data.personal.bio}
        </p>

        <motion.button
          onClick={createBurst}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold shadow-xl"
        >
          Celebrate Creativity 
        </motion.button>

        <div className="flex gap-5 mt-10 flex-wrap justify-center">
          <a
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            onClick={createBurst}
            className="p-4 rounded-full bg-white/10 hover:bg-pink-500 transition"
          >
            <Github />
          </a>

          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            onClick={createBurst}
            className="p-4 rounded-full bg-white/10 hover:bg-cyan-500 transition"
          >
            <Linkedin />
          </a>

          <a
            href={`mailto:${data.socials.email}`}
            onClick={createBurst}
            className="p-4 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black transition"
          >
            <Mail />
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/10"
        >
          <h2 className="text-4xl font-bold mb-8 text-pink-300">
            About Me
          </h2>

          <p className="text-gray-200 leading-relaxed mb-8">
            {data.personal.bio}
          </p>

          <div className="flex items-center gap-3 text-yellow-300">
            <MapPin />
            <span>{data.personal.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10">
            <div className="bg-pink-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold">
                {data.stats.yearsExperience}
              </h3>
              <p>Years</p>
            </div>

            <div className="bg-cyan-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold">
                {data.stats.projectsCompleted}
              </h3>
              <p>Projects</p>
            </div>

            <div className="bg-yellow-400/20 rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold">
                {data.stats.happyClients}
              </h3>
              <p>Clients</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SKILLS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center text-yellow-300 mb-16">
          Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.skills.map((skill, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              onClick={createBurst}
              className="bg-white/10 rounded-3xl p-6 border border-white/10 cursor-pointer"
            >
              <div className="flex justify-between mb-3">
                <span>{skill.name}</span>
                <span className="text-pink-300">{skill.level}%</span>
              </div>

              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center text-pink-300 mb-16">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.projects.map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, rotate: 1 }}
              onClick={createBurst}
              className="bg-white/10 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-lg cursor-pointer"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                  {project.title}
                </h3>

                <p className="text-gray-300 mb-5">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-sm bg-pink-500/20 text-pink-200"
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
                    onClick={createBurst}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-black font-semibold"
                  >
                    Live
                    <ExternalLink size={18} />
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={createBurst}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-pink-400"
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
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center text-cyan-300 mb-16">
          Experience
        </h2>

        <div className="space-y-8">
          {data.experience.map((exp, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              onClick={createBurst}
              className="bg-white/10 rounded-3xl p-8 border border-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-yellow-300" />
                <h3 className="text-2xl font-bold">{exp.role}</h3>
              </div>

              <p className="text-pink-300 mb-3">
                {exp.company} • {exp.period}
              </p>

              <p className="text-gray-300">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center text-yellow-300 mb-16">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ rotate: 1, scale: 1.02 }}
              onClick={createBurst}
              className="bg-white/10 rounded-3xl p-8 border border-white/10 cursor-pointer"
            >
              <p className="italic text-gray-200 mb-6">
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
                  <p className="text-pink-300 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <footer className="relative z-10 py-20 text-center border-t border-white/10">
        <h2 className="text-4xl font-bold text-pink-300 mb-6">
          Let’s Connect 
        </h2>

        <p className="text-gray-300 mb-10">
          Ready to create something exciting together?
        </p>

        <div className="flex justify-center gap-6">
          <a
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            onClick={createBurst}
            className="hover:text-pink-400 transition"
          >
            <Github size={30} />
          </a>

          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            onClick={createBurst}
            className="hover:text-cyan-400 transition"
          >
            <Linkedin size={30} />
          </a>

          <a
            href={`mailto:${data.socials.email}`}
            onClick={createBurst}
            className="hover:text-yellow-300 transition"
          >
            <Mail size={30} />
          </a>
        </div>

        <motion.button
          onClick={createBurst}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold shadow-xl"
        >
          Launch Celebration 
        </motion.button>

        <p className="text-gray-500 mt-10 text-sm">
          © 2026 {data.personal.name}
        </p>
      </footer>
    </div>
  );
}
    