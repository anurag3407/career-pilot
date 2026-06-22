import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Layers, Zap, Sparkles } from "lucide-react";
import data from "../../../../data/dummy_data.json";
import SectionHeading from "./SectionHeading";

const SEC = "relative z-10 py-24 px-4";

export default function About() {
  const { personal } = data;
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className={SEC}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading>About</SectionHeading>
        <div ref={ref} className="grid md:grid-cols-12 gap-8 items-center">

          <motion.div
            className="md:col-span-5 relative group"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500" />
            <div className="relative p-3 bg-slate-900/60 border border-white/5 rounded-3xl overflow-hidden aspect-square flex items-center justify-center backdrop-blur-sm">
              <div className="absolute inset-6 border border-indigo-500/20 rounded-2xl flex items-center justify-center opacity-30">
                <motion.div
                  className="w-3/4 h-3/4 border border-dashed border-purple-500/40 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="relative z-10 text-center p-6">
                <img
                  src={personal?.avatar || "https://api.dicebear.com/7.x/shapes/svg?seed=about"}
                  alt={personal?.name}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 border border-white/10"
                />
                <p className="text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">Location</p>
                <div className="flex items-center justify-center gap-2 text-white font-medium">
                  <MapPin size={16} className="text-indigo-400" />
                  <span>{personal?.location || "Remote"}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-7 space-y-6"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles className="text-indigo-400" size={22} />
              {personal?.name}
            </h3>
            <p className="text-slate-400 leading-relaxed">{personal?.bio}</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: Layers, color: "text-indigo-400", title: "Architecture", sub: "Structured modular patterns"  },
                { Icon: Zap,    color: "text-purple-400", title: "Performance",  sub: "Optimized rendering engines" },
              ].map(({ Icon, color, title, sub }) => (
                <motion.div
                  key={title}
                  whileHover={{ borderColor: "rgba(99,102,241,0.3)", y: -3 }}
                  className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm transition-all"
                >
                  <Icon className={`${color} mb-2`} size={20} />
                  <h4 className="font-semibold text-white mb-1 text-sm">{title}</h4>
                  <p className="text-xs text-slate-500">{sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}