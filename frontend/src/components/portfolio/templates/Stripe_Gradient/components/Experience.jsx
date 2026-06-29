import data from "../../../../../data/dummy_data.json";
import { motion } from "framer-motion";

export default function Experience() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-16 text-cyan-500">
          Experience
        </h2>

        <div className="space-y-8">
          {data.experience.map((exp, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10"
            >
              <div className="flex justify-between flex-wrap gap-3">
                <h3 className="text-2xl font-semibold text-indigo-300">
                  {exp.role}
                </h3>

                <span className="text-cyan-400">
                  {exp.period}
                </span>
              </div>

              <p className="font-medium mt-2">
                {exp.company}
              </p>

              <p className="text-slate-300 mt-4">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}