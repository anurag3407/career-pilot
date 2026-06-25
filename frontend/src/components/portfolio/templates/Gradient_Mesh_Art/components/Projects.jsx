import React from "react";
import data from "../../../../../data/dummy_data.json";
import { motion } from "framer-motion";

export default function Projects() {
  return (
    <section className="py-24 px-6 md:px-20" id="projects">
      <h2 className="text-4xl font-black text-center mb-12">
        Featured Projects
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {data.projects.map((p, i) => (
          <div
            key={i}
            className="
  bg-white/5 
  border border-white/10 
  backdrop-blur-xl 
  rounded-3xl 
  p-6 
  hover:bg-white/10 
  hover:-translate-y-2 
  hover:shadow-[0_20px_60px_-20px_rgba(0,255,255,0.3)]
  transition-all duration-300"
          >
            <motion.img 
            whileHover={{y: -10, scale: 1.05}}
            src={p.image} className="h-52 w-full object-cover" />

            <div className="p-6">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="text-gray-400 mt-2">{p.description}</p>

              <div className="flex gap-4 mt-4">
                <a className="text-cyan-300" href={p.liveUrl} target="_blank" rel="noopener noreferrer" >
                  Live
                </a>
                <a className="text-pink-300" href={p.githubUrl} target="_blank" rel="noopener noreferrer" >
                  Code
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
