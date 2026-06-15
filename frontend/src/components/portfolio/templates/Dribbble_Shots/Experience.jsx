import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionLabel from "./SectionLabel";
import data from "../../../../data/dummy_data.json";

export default function Experience() {
  const { experience } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref} className="py-28 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Experience</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-16"
        >
          Where I've <span className="text-[#ea4c89]">been</span>
        </motion.h2>

        <div className="relative max-w-3xl">
          {/* Animated timeline line */}
          <motion.div
            className="absolute left-[10px] top-0 w-px bg-gradient-to-b from-[#ea4c89] via-[#ea4c89]/30 to-transparent"
            initial={{ height: 0 }}
            animate={inView ? { height: "100%" } : {}}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />

          <div className="space-y-8 ml-10">
            {experience?.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.13 }}
                className="relative group"
              >
                {/* Dot */}
                <motion.div
                  className="absolute -left-[46px] top-5 w-4 h-4 rounded-full border-2 border-[#ea4c89] bg-white flex items-center justify-center shadow-sm"
                  whileInView={{ scale: [0.4, 1.3, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.13 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ea4c89]" />
                </motion.div>

                <motion.div
                  whileHover={{ x: 4, boxShadow: "0 8px 32px rgba(234,76,137,0.07)" }}
                  className="bg-white border border-[#f0f0f0] rounded-2xl p-6 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-[#1a1a1a] font-bold text-base">{exp.role}</h3>
                      <p className="text-[#ea4c89] text-sm font-medium">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#fef0f5] text-[#ea4c89] text-[10px] font-semibold border border-[#fad7e8]">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-[#999] text-sm leading-relaxed">{exp.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}