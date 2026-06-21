import React from "react";
import { motion } from "framer-motion";

export default function About({ data }) {
  const { personal, stats } = data;
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-6xl mx-auto text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-10"
        >
          <h2 className="text-4xl font-bold text-rose-800 mb-8 text-center">
            About Me
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <img
                src={personal.avatar}
                alt={personal.name || "Profile Avatar"}
                className="w-64 h-64 object-cover rounded-3xl shadow-xl"
              />
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {personal.bio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                {Object.entries(stats).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-pink-50 rounded-2xl p-5 text-center"
                  >
                    <h3 className="text-3xl font-bold text-rose-500">
                      {value}+
                    </h3>

                    <p className="text-sm text-gray-600 mt-2 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
