import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, FolderKanban } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function Projects({ data }) {
  const { projects } = data;

  const positions = [
    "left-[6%] top-0",
    "right-[8%] top-[180px]",
    "left-[28%] top-[420px]",
    "right-[22%] top-[640px]",
    "left-[10%] top-[900px]",
    "right-[10%] top-[1180px]",
  ];

  return (
    <div className="absolute top-[1450px] left-0 w-full min-h-[1700px]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute left-1/2 -translate-x-1/2 -top-20 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <FolderKanban className="text-cyan-400" size={24} />
          <h2 className="text-4xl font-black">Projects Canvas</h2>
        </div>

        <p className="text-gray-400 max-w-xl">
          Explore projects placed across the infinite workspace.
        </p>
      </motion.div>

      {projects.map((project, index) => {
        const position = positions[index % positions.length];
        const rotation =
          index % 2 === 0
            ? (index % 4) + 1
            : -((index % 4) + 1);

        return (
          <div
            key={project.title}
            className={`absolute ${position} w-[90%] md:w-[420px]`}
          >
            <CanvasCard
              delay={index * 0.08}
              rotate={rotation}
            >
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                src={project.image}
                alt={project.title}
                className="w-full h-52 object-cover rounded-2xl mb-5"
              />

              <h3 className="text-2xl font-bold mb-3">
                {project.title}
              </h3>

              <p className="text-gray-400 leading-7 mb-5">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:scale-105 transition"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <Github size={16} />
                  Code
                </a>
              </div>
            </CanvasCard>
          </div>
        );
      })}

      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        <line
          x1="25%"
          y1="120"
          x2="75%"
          y2="350"
          stroke="white"
          strokeWidth="1"
          strokeDasharray="6 6"
        />

        <line
          x1="75%"
          y1="350"
          x2="35%"
          y2="700"
          stroke="white"
          strokeWidth="1"
          strokeDasharray="6 6"
        />

        <line
          x1="35%"
          y1="700"
          x2="70%"
          y2="1050"
          stroke="white"
          strokeWidth="1"
          strokeDasharray="6 6"
        />

        <line
          x1="70%"
          y1="1050"
          x2="25%"
          y2="1400"
          stroke="white"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
      </svg>
    </div>
  );
}