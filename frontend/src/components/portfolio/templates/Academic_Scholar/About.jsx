import React from "react";
import { motion } from "framer-motion";

const About = ({ data }) => {
  const { personal } = data;

  return (
    <section className="py-28 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16"
        >
          <div>
            <p className="uppercase tracking-[0.3em] text-amber-200 text-sm mb-4">
              About
            </p>

            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              Research Philosophy &
              Academic Vision
            </h2>
          </div>

          <div className="space-y-6 text-stone-400 leading-relaxed text-lg">
            <p>{personal.bio}</p>

            <p>
              Passionate about interdisciplinary research,
              innovation, and creating meaningful contributions
              through scholarly work and collaboration.
            </p>

            <div className="pt-6">
              <div className="border-l-2 border-amber-200 pl-6 italic text-stone-300">
                “Advancing knowledge through rigorous inquiry,
                innovation, and impactful research.”
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;