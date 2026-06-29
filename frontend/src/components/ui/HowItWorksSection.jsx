import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Sparkles, Target, ArrowRight } from "lucide-react";

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

function StepCard({ item, index }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Connector arrow between cards (desktop) */}
      {index < steps.length - 1 && (
        <div className="absolute -right-4 top-16 z-20 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-primary lg:flex">
          <ArrowRight className="h-4 w-4" />
        </div>
      )}

      <div className="relative h-full overflow-hidden rounded-3xl border border-border bg-card/50 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
        {/* Big watermark numeral */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-black leading-none text-foreground/[0.04]"
        >
          {item.step}
        </span>

        {/* Gradient numeral chip */}
        <div className="relative mb-6 inline-flex items-center gap-3">
          <span className="bg-linear-to-br from-primary to-secondary bg-clip-text text-2xl font-black tracking-tight text-transparent">
            {item.step}
          </span>
          <span className="h-px w-10 bg-linear-to-r from-primary/60 to-transparent" />
        </div>

        {/* Icon */}
        <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted text-primary transition-all duration-500 group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/15">
          <Icon className="h-6 w-6" strokeWidth={1.8} />
          <span className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <h3 className="mb-3 text-xl font-black tracking-tight text-foreground">
          {item.title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "center 50%"],
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                How it works
              </span>
            </div>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground md:text-6xl">
            From résumé to{" "}
            <span className="gradient-text-animated">dream role</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-muted-foreground">
            Three simple steps to accelerate your job search and land your dream
            role.
          </p>
        </motion.div>

        {/* Steps with animated progress line */}
        <div ref={ref} className="relative">
          {/* Track + animated fill (desktop) */}
          <div className="absolute left-0 right-0 top-[4.75rem] hidden lg:block">
            <div className="h-px w-full bg-border" />
            <motion.div
              style={{ width: lineWidth }}
              className="absolute top-0 h-px bg-linear-to-r from-primary via-secondary to-primary"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((item, i) => (
              <StepCard key={item.step} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
