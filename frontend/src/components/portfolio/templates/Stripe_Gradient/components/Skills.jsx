import data from "../../../../../data/dummy_data.json";
import { motion } from "framer-motion";

export default function Skills() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-20">

          <h2 className="text-5xl font-bold mb-6">
            My Work{" "}
            <span className="text-blue-500">
              Skills
            </span>
          </h2>

        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

          {data.skills.map((skill, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                bg-[#0c1228]/80
                backdrop-blur-xl
                border
                border-slate-800
                rounded-2xl
                p-8
                text-center
                shadow-lg
                hover:border-blue-500/40
                transition-all
              "
            >

              {/* Icon */}
              <div className="text-6xl mb-6">
                {skill.icon}
              </div>

              {/* Name */}
              <h3 className="text-2xl font-semibold mb-8">
                {skill.name}
              </h3>

              {/* Progress */}
              <div className="w-full">

                <div
                  className="
                    h-4
                    rounded-full
                    bg-slate-800
                    overflow-hidden
                  "
                >
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    whileInView={{
                      width: `${skill.level}%`,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-indigo-400
                      to-blue-500
                    "
                  />
                </div>

                <div className="mt-3 text-sm font-semibold text-indigo-400">
                  {skill.level}%
                </div>

              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}