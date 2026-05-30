import React, { useMemo } from "react";
import data from "../../../../data/dummy_data.json";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  MapPin,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

const CherryBlossom = () => {
  const {
    personal,
    socials,
    skills,
    projects,
    experience,
    testimonials,
    stats,
  } = data;

  const skillCategories = [...new Set(skills.map((skill) => skill.category))];

  const petals = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      initial: {
        opacity: 0,
        y: -50,
        x: Math.random() * 100 + "vw",
        rotate: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.7,
      },
      animate: {
        opacity: [0, 1, 1, 0],
        y: "110vh",
        x: `${Math.random() * 100 - 50}vw`,
        rotate: Math.random() * 1000,
      },
      transition: {
        duration: 10 + Math.random() * 15,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 15,
      },
    }));
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-pink-50 via-white to-rose-100 text-gray-800">
      {/* Falling Sakura Petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={petal.initial}
            animate={petal.animate}
            transition={petal.transition}
            className="absolute w-5 h-5 bg-pink-300/70 rounded-[100%_10%_100%_10%] shadow-lg"
          />
        ))}
      </div>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <p className="text-pink-500 font-semibold tracking-widest uppercase mb-4">
              {personal.tagline}
            </p>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-rose-900">
              {personal.name}
            </h1>

            <h2 className="mt-4 text-2xl text-rose-600 font-medium">
              {personal.title}
            </h2>

            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
              {personal.bio}
            </p>

            <div className="flex items-center gap-2 mt-6 text-gray-500">
              <MapPin size={18} />
              <span>{personal.location}</span>
            </div>

            <div className="flex gap-4 mt-8 flex-wrap">
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition duration-300"
              >
                <Github />
              </a>

              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition duration-300"
              >
                <Linkedin />
              </a>

              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter Profile"
                className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition duration-300"
              >
                <Twitter />
              </a>

              <a
                href={`mailto:${socials.email}`}
                aria-label="Email Me"
                className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition duration-300"
              >
                <Mail />
              </a>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="relative flex justify-center"
          >
            <div className="absolute w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-40"></div>

            <img
              src={personal.avatar}
              alt={personal.name}
              className="relative z-10 w-72 h-72 md:w-80 md:h-80 object-cover rounded-full border-8 border-white shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-10"
          >
            <h2 className="text-4xl font-bold text-rose-800 mb-8 text-center">
              About Me
            </h2>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center">
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-64 h-64 object-cover rounded-3xl shadow-xl"
                />
              </div>

              <div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {personal.bio}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                  {Object.entries(stats).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-pink-50 rounded-2xl p-5 text-center"
                    >
                      <h3 className="text-3xl font-bold text-rose-500">
                        {value}+
                      </h3>

                      <p className="text-sm text-gray-600 mt-2 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-rose-800 mb-14">
            Skills
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {skillCategories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ y: -5 }}
                className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl"
              >
                <h3 className="text-2xl font-semibold mb-6 text-pink-600">
                  {category}
                </h3>

                <div className="space-y-5">
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill) => (
                      <div key={`${skill.category}-${skill.name}`}>
                        <div className="flex justify-between mb-2">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>

                        <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="relative z-10 px-6 py-20 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-rose-800 mb-14">
            Projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, index) => (
              <motion.div
                whileHover={{ y: -10 }}
                key={`${project.title}-${index}`}
                className="bg-white rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-52 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-rose-700">
                    {project.title}
                  </h3>

                  <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {project.techStack.map((tech) => (
                      <span
                        key={`${project.title}-${tech}`}
                        className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-5 mt-6">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${project.title} live demo`}
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition"
                    >
                      <ExternalLink size={18} />
                      Live
                    </a>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${project.title} source code on GitHub`}
                      className="flex items-center gap-2 text-gray-700 hover:text-black transition"
                    >
                      <Github size={18} />
                      Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-rose-800 mb-14">
            Experience
          </h2>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={`${exp.role}-${exp.company}-${index}`}
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-pink-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-pink-100 text-pink-600">
                    <Briefcase />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-rose-700">
                      {exp.role}
                    </h3>

                    <p className="text-pink-600 font-medium">
                      {exp.company}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {exp.period}
                    </p>

                    <p className="mt-4 text-gray-600 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 px-6 py-20 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-rose-800 mb-14">
            Testimonials
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={`${testimonial.name}-${index}`}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    loading="lazy"
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-lg">
                      {testimonial.name}
                    </h3>

                    <p className="text-sm text-pink-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-gray-600 leading-relaxed italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <footer className="relative z-10 px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-rose-800">
          Let's Connect
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Interested in collaborating, building something beautiful, or just
          saying hello? Feel free to reach out.
        </p>

        <a
          href={`mailto:${socials.email}`}
          className="inline-flex items-center gap-3 mt-8 px-8 py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-full shadow-lg hover:scale-105 transition duration-300"
        >
          <Mail />
          {socials.email}
        </a>

        <div className="flex justify-center gap-6 mt-10">
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            className="hover:text-pink-500 transition duration-300"
          >
            <Github />
          </a>

          <a
            href={socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Profile"
            className="hover:text-pink-500 transition duration-300"
          >
            <Linkedin />
          </a>

          <a
            href={socials.twitter}
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter Profile"
            className="hover:text-pink-500 transition duration-300"
          >
            <Twitter />
          </a>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Crafted with love inspired by Sakura blossoms
        </p>
      </footer>
    </div>
  );
};

export default CherryBlossom;
