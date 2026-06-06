import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { AnimatedHeading } from './AnimatedHeading';

const getEntranceDirection = (index) => {
  const directions = [
    { x: -300, y: 0 }, { x: 300, y: 0 }, { x: 0, y: -300 }, { x: 0, y: 300 },
    { x: -300, y: -300 }, { x: 300, y: -300 }, { x: -300, y: 300 }, { x: 300, y: 300 }
  ];
  return directions[index % directions.length];
};

export const Projects = () => {
  return (
    <section className="py-24 px-6 bg-zinc-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <AnimatedHeading text="Projects" dark={true} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, i) => {
            const direction = getEntranceDirection(i);
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: direction.x, y: direction.y, scale: 0.5, rotate: (i % 2 === 0 ? -15 : 15) }}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.2 }} // Strict scroll trigger
                transition={{ type: "spring", stiffness: 80, damping: 12, mass: 1.2, delay: i * 0.15 }}
                whileHover={{ scale: 1.03, rotateY: 5, rotateX: 5, boxShadow: "0px 30px 50px rgba(0,0,0,0.4)", transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="bg-zinc-800 rounded-3xl overflow-hidden group flex flex-col h-full transform perspective-1000"
              >
                <div className="h-48 overflow-hidden relative">
                  <motion.img 
                    src={project.image} 
                    alt={project.title} 
                    whileHover={{ scale: 1.15, rotateZ: (i % 2 === 0 ? 3 : -3) }}
                    transition={{ type: "spring", stiffness: 250, damping: 15, mass: 0.8 }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-zinc-400 mb-6 flex-1 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-xs px-3 py-1 bg-zinc-700 rounded-full text-zinc-300">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-auto">
                    {project.liveUrl && (
                      <motion.a href={project.liveUrl} target="_blank" rel="noreferrer" whileHover={{ scale: 1.1, x: 5, transition: { type: "spring", stiffness: 400 } }} className="flex items-center gap-2 text-sm font-semibold text-white hover:text-indigo-400">
                        <ExternalLink size={16} /> Live Demo
                      </motion.a>
                    )}
                    {project.githubUrl && (
                      <motion.a href={project.githubUrl} target="_blank" rel="noreferrer" whileHover={{ scale: 1.1, x: 5, transition: { type: "spring", stiffness: 400 } }} className="flex items-center gap-2 text-sm font-semibold text-white hover:text-indigo-400">
                        <Github size={16} /> Code
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};