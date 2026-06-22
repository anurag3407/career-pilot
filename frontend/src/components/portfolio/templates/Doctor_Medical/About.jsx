import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, BookOpen, Heart, Shield } from "lucide-react";

const highlights = [
  { icon: Award, label: "Board Certified", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: BookOpen, label: "Research Published", color: "bg-teal-50 text-teal-600 border-teal-100" },
  { icon: Heart, label: "Patient-Centered", color: "bg-rose-50 text-rose-500 border-rose-100" },
  { icon: Shield, label: "Trusted Care", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
];

export default function About({ data }) {
  const { personal } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-50 rounded-3xl -z-10" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-50 rounded-2xl -z-10" />
              <div className="relative w-full aspect-[4/5] max-w-sm rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
                {personal?.avatar ? (
                  <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-teal-50 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-40 h-40 text-blue-200" stroke="currentColor" strokeWidth="0.8">
                      <circle cx="12" cy="8" r="5" />
                      <path d="M3 21c0-5 4-9 9-9s9 4 9 9" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="absolute bottom-8 -right-4 bg-blue-600 text-white rounded-2xl px-5 py-4 shadow-xl">
                <p className="text-3xl font-bold">{personal?.yearsOfExperience ?? "10"}+</p>
                <p className="text-xs opacity-80 font-medium">Years of Practice</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase block mb-4">About Me</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Dedicated to <span className="text-blue-600">Excellence</span> in Medical Care
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6 text-base">
              {personal?.bio ?? "With over a decade of clinical experience, I am committed to providing comprehensive, compassionate healthcare tailored to each patient's unique needs."}
            </p>
            {personal?.about && (
              <p className="text-slate-500 leading-relaxed mb-8 text-base">{personal.about}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-8">
              {highlights.map(({ icon: Icon, label, color }) => (
                <div key={label} className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${color}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-semibold">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {personal?.specializations && personal.specializations.map((spec) => (
                <span key={spec} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-4 py-1.5 rounded-full">
                  {spec}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}