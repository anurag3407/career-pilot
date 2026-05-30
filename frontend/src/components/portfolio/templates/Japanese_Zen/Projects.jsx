import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Projects() {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
      <h2 className="text-4xl font-light mb-16 text-center">
        Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {data.projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-60 object-cover"
            />

            <div className="p-8">
              <h3 className="text-2xl font-medium mb-4">
                {project.title}
              </h3>

              <p className="text-stone-600 leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-stone-200 text-sm text-stone-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-5">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-black"
                >
                  <ExternalLink size={18} />
                  Live
                </a>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-black"
                >
                  <Github size={18} />
                  Code
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}