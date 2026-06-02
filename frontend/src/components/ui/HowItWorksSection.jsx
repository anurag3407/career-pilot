import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, Sparkles, Target } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: FileText,
    title: "Upload Your Resume",
    description:
      "Start by uploading your existing resume. Our AI will analyze your experience, skills, and achievements to understand your profile.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "AI Enhancement",
    description:
      "Get intelligent suggestions to optimize your resume. Improve ATS compatibility, enhance keywords, and highlight your best achievements.",
  },
  {
    step: "03",
    icon: Target,
    title: "Match & Apply",
    description:
      "Discover perfectly matched opportunities and apply with your optimized resume. Track every application in your personalized dashboard.",
  },
];

function TimelineRow({ item, index, isLast }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px 0px",
  });
  const Icon = item.icon;

  return (
    <div ref={ref} className="flex items-stretch">
      {/* Spine */}
      <div className="flex flex-col items-center w-12 shrink-0">
        {/* Line above — invisible on first step */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          style={{ transformOrigin: "bottom" }}
          className={`w-px flex-1 ${index === 0 ? "bg-transparent" : "bg-border"}`}
          aria-hidden="true"
        />

        {/* Numbered node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
          className="shrink-0 w-10 h-10 rounded-full border-2 border-primary bg-background
                     flex items-center justify-center text-xs font-bold text-primary
                     ring-4 ring-background z-10"
        >
          {item.step}
        </motion.div>

        {/* Line below — invisible on last step */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          style={{ transformOrigin: "top" }}
          className={`w-px flex-1 ${
            isLast ? "bg-transparent" : "bg-border"
          }`}
          aria-hidden="true"
        />
      </div>

      {/* Card */}
      <div className={`flex-1 pl-6 ${isLast ? "pb-0" : "pb-10"}`}>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="group relative rounded-2xl border border-border bg-card p-6
                     hover:border-primary/40 hover:shadow-sm transition-all duration-300 overflow-hidden"
        >
          {/* Watermark step number */}
          <span
            className="pointer-events-none select-none absolute -top-2 right-3
                       text-8xl font-black text-foreground/[0.04] leading-none"
            aria-hidden
          >
            {item.step}
          </span>

          <div className="relative flex items-start gap-4">
            {/* Icon box */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="shrink-0 w-11 h-11 rounded-xl bg-muted border border-border
                         flex items-center justify-center
                         group-hover:-translate-y-1 transition-transform duration-300"
            >
              <Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
            </motion.div>

            <div>
              <h3 className="text-base font-black text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-40 relative overflow-hidden">
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            How{" "}
            <span className="text-primary underline decoration-primary/20 underline-offset-8">
              careerpilot
            </span>{" "}
            works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Three simple steps to accelerate your job search and land your dream role
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="flex flex-col">
          {steps.map((item, i) => (
            <TimelineRow
              key={item.step}
              item={item}
              index={i}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
