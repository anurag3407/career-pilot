import { useState } from "react";
import { Search, Briefcase, BarChart3, Users, FileText, Zap, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    title: "Advanced Search",
    icon: Search,
    desc: "Filter by salary, location, company size, and more. Find your perfect role with precision targeting.",
  },
  {
    title: "Application Tracking",
    icon: Briefcase,
    desc: "Track every application status in one dashboard. Never lose sight of your opportunities.",
  },
  {
    title: "Analytics & Insights",
    icon: BarChart3,
    desc: "Visualize your job search progress and patterns. Make data-driven decisions for your career.",
  },
  {
    title: "Community",
    icon: Users,
    desc: "Connect with other job seekers and share tips. Learn from success stories and grow together.",
  },
  {
    title: "Multiple Resumes",
    icon: FileText,
    desc: "Create role-specific resume versions. Tailor your experience for every opportunity.",
  },
  {
    title: "Quick Apply",
    icon: Zap,
    badge: "New",
    desc: "Apply to multiple jobs with one click. Maximize your reach with minimal effort.",
  },
];

export default function AdditionalFeatures() {
  const [open, setOpen] = useState(0);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl px-4 py-24">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70"
        >
          003 — Capabilities
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-4xl font-black tracking-tighter text-foreground md:text-6xl"
        >
          Under the hood
        </motion.h2>

        <div className="mt-14 border-t border-border">
          {items.map(({ title, icon: Icon, desc, badge }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-border"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="group flex w-full items-center gap-5 py-6 text-left"
              >
                <span className="text-[10px] font-black tabular-nums text-muted-foreground/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon className={`h-5 w-5 shrink-0 transition-colors duration-300 ${
                  open === i ? "text-primary" : "text-muted-foreground/50"
                }`} />
                <span className={`flex-1 text-lg font-black tracking-tight transition-colors duration-300 md:text-2xl ${
                  open === i ? "text-foreground" : "text-muted-foreground/60 group-hover:text-foreground"
                }`}>
                  {title}
                </span>
                {badge && (
                  <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary">
                    {badge}
                  </span>
                )}
                <span className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                  open === i
                    ? "border-primary bg-primary text-primary-foreground rotate-0"
                    : "border-border text-muted-foreground rotate-0"
                }`}>
                  {open === i ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-lg pb-6 pl-[4.5rem] text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
                      {desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
