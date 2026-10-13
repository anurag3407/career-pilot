import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

export default function HowItWorksSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 60%", "end 40%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden py-32 lg:py-40">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">
            006 — Process
          </span>
          <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-tighter text-foreground md:text-7xl">
            Three steps.
            <br />
            <span className="text-muted-foreground/40">That's it.</span>
          </h2>
        </motion.div>

        {/* Vertical timeline */}
        <div ref={containerRef} className="relative">
          {/* Timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border md:left-[35px]" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[27px] top-0 bottom-0 w-px origin-top bg-primary md:left-[35px]"
          />

          <div className="space-y-20">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex gap-8 md:gap-12"
              >
                {/* Node */}
                <div className="relative z-10 shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-background shadow-lg shadow-primary/10 md:h-[72px] md:w-[72px]">
                    <item.icon className="h-6 w-6 text-primary md:h-7 md:w-7" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="pb-4 pt-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground md:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-base font-medium leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
