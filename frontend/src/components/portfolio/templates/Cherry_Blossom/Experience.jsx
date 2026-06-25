import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function Experience({ data }) {
  const { experience } = data;
  return (
    <section className="relative z-10 px-6 py-20 text-left">
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
  );
}
