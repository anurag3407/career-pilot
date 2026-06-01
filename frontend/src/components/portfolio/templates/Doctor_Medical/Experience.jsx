import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar } from "lucide-react";

export default function Experience({ data }) {
  const { experience } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase block mb-3">Career</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Professional Experience
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base">A track record built on dedication, clinical excellence, and a commitment to advancing patient outcomes.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-transparent md:-translate-x-px" />

          <div className="space-y-10">
            {(experience ?? []).map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className={`relative flex flex-col md:flex-row ${isLeft ? "md:flex-row-reverse" : ""} gap-8 md:gap-0`}
                >
                  <div className="absolute left-6 md:left-1/2 top-6 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-md md:-translate-x-1.5 z-10" />

                  <div className={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? "md:pl-12" : "md:pr-12"}`}>
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{exp.title ?? exp.role}</h3>
                          <p className="text-blue-600 font-semibold text-sm mt-0.5">{exp.company ?? exp.institution ?? exp.organization}</p>
                        </div>
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                          <Briefcase className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.duration ?? exp.period ?? exp.date ?? `${exp.startDate ?? ""} – ${exp.endDate ?? "Present"}`}</span>
                        {exp.location && <span className="ml-1">· {exp.location}</span>}
                      </div>
                      {exp.description && (
                        <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                      )}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {exp.highlights.map((h, hi) => (
                            <li key={hi} className="text-xs text-slate-500 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      {exp.type && (
                        <span className="inline-block mt-3 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
                          {exp.type}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}