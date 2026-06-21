import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

export default function Projects({ data }) {
  const { projects } = data;
  return (
    <section className="relative z-10 px-6 py-20 bg-white/40 text-left">
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
                alt={project.title || "Project Screenshot"}
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
                  {project.liveUrl && (
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
                  )}

                  {project.githubUrl && (
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
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
