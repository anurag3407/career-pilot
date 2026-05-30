import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import data from "../../../../data/dummy_data.json";

const ElasticCard = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{
        scaleX: 1.03,
        scaleY: 0.97,
        rotate: -1,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 12,
      }}
      className={`rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default function ElasticCards() {
  const { personal, socials, skills, projects, experience, testimonials, stats } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white p-6">

      <ElasticCard className="max-w-5xl mx-auto mt-10">
        <div className="flex flex-col md:flex-row items-center gap-8">

          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            src={personal.avatar}
            alt={personal.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-pink-500"
          />

          <div>

            <h1 className="text-5xl font-bold">
              {personal.name}
            </h1>

            <p className="text-pink-300 text-xl mt-2">
              {personal.title}
            </p>

            <p className="text-gray-300 mt-4 leading-relaxed">
              {personal.bio}
            </p>

            <div className="flex gap-4 mt-6">

              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-400 transition"
              >
                <Github />
              </a>

              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-400 transition"
              >
                <Linkedin />
              </a>

              <a
                href={`mailto:${socials.email}`}
                className="hover:text-pink-400 transition"
              >
                <Mail />
              </a>

            </div>
          </div>
        </div>
      </ElasticCard>
       <ElasticCard className="max-w-5xl mx-auto mt-8">
        <ElasticCard className="max-w-5xl mx-auto mt-8">
  <h2 className="text-3xl font-bold mb-6 text-pink-400">
    Skills
  </h2>

  <div className="grid md:grid-cols-2 gap-5">
    {skills.map((skill, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.03, x: 6 }}
        transition={{ type: "spring", stiffness: 250, damping: 12 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-4"
      >
        <div className="flex justify-between mb-2">
          <span className="font-semibold">{skill.name}</span>
          <span className="text-pink-300">{skill.level}%</span>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
          />
        </div>

        <p className="text-sm text-gray-400 mt-2">
          {skill.category}
        </p>
      </motion.div>
    ))}
  </div>
</ElasticCard>

  <div className="grid md:grid-cols-2 gap-8 items-center">

    <div>
      <h2 className="text-3xl font-bold mb-4 text-pink-400">
        About Me
      </h2>

      <p className="text-gray-300 leading-relaxed">
        {personal.bio}
      </p>

      <p className="text-gray-400 mt-4">
        Passionate about building interactive experiences and modern web applications.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-4">

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white/5 rounded-2xl p-4 text-center border border-white/10"
      >
        <h3 className="text-3xl font-bold text-pink-400">
          {data.stats.yearsExperience}+
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          Years
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white/5 rounded-2xl p-4 text-center border border-white/10"
      >
        <h3 className="text-3xl font-bold text-pink-400">
          {data.stats.projectsCompleted}+
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          Projects
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white/5 rounded-2xl p-4 text-center border border-white/10"
      >
        <h3 className="text-3xl font-bold text-pink-400">
          {data.stats.happyClients}+
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          Clients
        </p>
      </motion.div>

    </div>
  </div>
  <ElasticCard className="max-w-5xl mx-auto mt-8">
  <h2 className="text-3xl font-bold mb-6 text-pink-400">
    Projects
  </h2>

  <div className="grid md:grid-cols-2 gap-6">
    {projects.map((project, index) => (
      <motion.div
        key={index}
        whileHover={{
          scaleX: 1.04,
          scaleY: 0.96,
          rotate: index % 2 === 0 ? 1 : -1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 10 }}
        className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl"
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-44 object-cover"
        />

        <div className="p-5">
          <h3 className="text-xl font-bold text-white">
            {project.title}
          </h3>

          <p className="text-gray-300 mt-2 text-sm">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1 rounded-full bg-pink-500/20 text-pink-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</ElasticCard>

<ElasticCard className="max-w-5xl mx-auto mt-8">
  <h2 className="text-3xl font-bold mb-6 text-pink-400">
    Experience
  </h2>

  <div className="space-y-5">
    {experience.map((exp, index) => (
      <motion.div
        key={index}
        whileHover={{ x: 10 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5"
      >
        <h3 className="text-xl font-bold">
          {exp.role}
        </h3>

        <p className="text-pink-300">
          {exp.company}
        </p>

        <p className="text-gray-400 text-sm mt-1">
          {exp.period}
        </p>

        <p className="text-gray-300 mt-3">
          {exp.description}
        </p>
      </motion.div>
    ))}
  </div>
</ElasticCard>
<ElasticCard className="max-w-5xl mx-auto mt-8">
  <h2 className="text-3xl font-bold mb-6 text-pink-400">
    Testimonials
  </h2>

  <div className="grid md:grid-cols-2 gap-6">
    {testimonials.map((testimonial, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.03 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5"
      >
        <div className="flex items-center gap-4 mb-4">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <h3 className="font-bold">
              {testimonial.name}
            </h3>

            <p className="text-sm text-pink-300">
              {testimonial.role}
            </p>
          </div>
        </div>

        <p className="text-gray-300 italic">
          "{testimonial.text}"
        </p>
      </motion.div>
    ))}
  </div>
</ElasticCard>
<ElasticCard className="max-w-5xl mx-auto mt-8 mb-10">
  <h2 className="text-3xl font-bold mb-6 text-pink-400">
    Contact
  </h2>

  <div className="flex flex-col md:flex-row gap-4">
    <a
      href={socials.github}
      target="_blank"
      rel="noreferrer"
      className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-white/10"
    >
      GitHub
    </a>

    <a
      href={socials.linkedin}
      target="_blank"
      rel="noreferrer"
      className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-white/10"
    >
      LinkedIn
    </a>

    <a
      href={`mailto:${socials.email}`}
      className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-white/10"
    >
      Email
    </a>
  </div>
</ElasticCard>


</ElasticCard>
    </div>
  );
}