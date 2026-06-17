import React from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Calendar } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function Experience({ data }) {
  const { experience } = data;

  return (
    <div className="absolute top-[3450px] left-[8%] w-[90%] md:w-[650px]">
      <CanvasCard delay={0.25} rotate={-2}>
        <div className="flex items-center gap-3 mb-8">
          <BriefcaseBusiness
            className="text-emerald-400"
            size={24}
          />
          <h2 className="text-3xl font-bold">
            Experience
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-[10px] top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-10">
            {experience.map((item, index) => (
              <motion.div
                key={`${item.company}-${index}`}
                initial={{
                  opacity: 0,
                  x: -40,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="relative pl-10"
              >
                <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]" />

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">
                        {item.role}
                      </h3>

                      <p className="text-emerald-300 font-medium mt-1">
                        {item.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={14} />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 leading-7 mt-4">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CanvasCard>
    </div>
  );
}