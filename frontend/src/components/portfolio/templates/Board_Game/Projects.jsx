import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import data from "../../../../data/dummy_data.json";

export default function Projects() {
  return (
    <section 
    id="board-projects"
    className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

              {/* Floating Board Tiles */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">

  {[...Array(20)].map((_, i) => (
    <motion.div
      key={i}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 6 + i,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute rounded-3xl opacity-10 blur-sm"
      style={{
        width: "70px",
        height: "70px",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: [
          "#ef4444",
          "#eab308",
          "#3b82f6",
          "#22c55e",
          "#a855f7",
        ][i % 5],
      }}
    />
  ))}

 </div>
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div
              className="
                w-20 h-20
                rounded-2xl
                bg-blue-500
                flex items-center justify-center
                text-3xl font-bold text-white
                shadow-xl
              "
            >
              03
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white">
            Projects
          </h2>

          <p className="text-slate-400 mt-3">
            Explore the projects I've built during my journey
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {data.projects?.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileHover={{
              y: -10,
              scale: 1.02
             }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="
                bg-[#0B1224]
                border border-slate-700
                rounded-3xl
                overflow-hidden
                shadow-xl
                hover:border-blue-500
                transition-all
              "
            >
              {/* Project Image */}
              <img
                src={project.image}
                alt={project.title}
                className="
                  w-full
                  h-52
                  object-cover
                "
              />

              <div className="p-6">

                {/* Title */}
                <h3 className="text-xl font-bold text-white">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 mt-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {project.techStack?.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                        bg-blue-500/20
                        text-blue-400
                      "
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      flex items-center gap-2
                      px-4 py-2
                      rounded-xl
                      bg-blue-500
                      text-white
                      hover:bg-blue-600
                      transition
                    "
                  >
                    <ExternalLink size={16} />
                    Live
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      flex items-center gap-2
                      px-4 py-2
                      rounded-xl
                      border border-slate-600
                      text-white
                      hover:border-blue-500
                      transition
                    "
                  >
                    <Github size={16} />
                    Code
                  </a>

                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}