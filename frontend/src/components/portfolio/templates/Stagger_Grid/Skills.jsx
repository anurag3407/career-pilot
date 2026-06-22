import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';
import { AnimatedHeading } from './AnimatedHeading';

export const Skills = () => {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <AnimatedHeading text="Skills" />
        <motion.div 
          className="flex flex-wrap gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Wrap in parent whileInView to stagger children
          variants={{
            visible: { transition: { staggerChildren: 0.06 } },
            hidden: {}
          }}
        >
          {data.skills.map((skill, index) => {
            const randomRotation = index % 2 === 0 ? -60 : 60;
            const lateralOffset = index % 3 === 0 ? -50 : (index % 3 === 1 ? 50 : 0);
            
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: -200, x: lateralOffset, rotate: randomRotation, scale: 0.2 },
                  visible: { 
                    opacity: 1, y: 0, x: 0, rotate: 0, scale: 1,
                    transition: { type: "spring", stiffness: 200, damping: 9, mass: 0.8 }
                  }
                }}
                whileHover={{ scale: 1.15, rotate: (index % 2 === 0 ? 5 : -5), y: -8, backgroundColor: "#18181b", color: "#ffffff", transition: { type: "spring", stiffness: 600, damping: 10 } }}
                whileTap={{ scale: 0.85, y: 5, transition: { type: "spring", stiffness: 800, damping: 15 } }}
                className="px-6 py-3 bg-zinc-100 text-zinc-800 rounded-full font-semibold border border-zinc-200 cursor-pointer"
              >
                {skill.name}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  );
};