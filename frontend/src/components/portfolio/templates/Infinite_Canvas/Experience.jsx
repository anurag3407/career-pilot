import React from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, CalendarDays } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function Experience({ data }) {
  const experience = Array.isArray(data?.experience)
    ? data.experience
    : [];

  if (experience.length === 0) {
    return (
      <CanvasCard>
        <div className="text-center py-12">
          <BriefcaseBusiness
            size={48}
            className="mx-auto mb-4 text-emerald-400"
          />

          <h2 className="text-3xl font-bold mb-3">
            Experience
          </h2>

          <p className="text-gray-400">
            No experience data available.
          </p>
        </div>
      </CanvasCard>
    );
  }

  return (
    <CanvasCard delay={0.2}>
      <div className="flex items-center gap-3 mb-8">
        <BriefcaseBusiness
          size={24}
          className="text-emerald-400"
        />

        <h2 className="text-3xl font-bold">
          Experience
        </h2>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-8">
          {experience.map((item, index) => (
            <motion.div
              key={`${item?.company || "company"}-${index}`}
              initial={{
                opacity: 0,
                x: -20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="relative pl-10"
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#030712]" />

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-xl font-bold">
                      {item?.role ||
                        "Position Not Specified"}
                    </h3>

                    <p className="text-emerald-300 mt-1">
                      {item?.company ||
                        "Company Not Specified"}
                    </p>
                  </div>

                  {item?.period && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <CalendarDays size={15} />
                      <span>{item.period}</span>
                    </div>
                  )}

                  <p className="text-gray-400 leading-7">
                    {item?.description ||
                      "No description available."}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CanvasCard>
  );
}