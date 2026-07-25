import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Bell, Globe, ArrowRight } from "lucide-react";

const features = [
  {
    id: "resume",
    number: "A",
    title: "AI-Powered Resume Enhancement",
    description:
      "Transform your resume with cutting-edge AI. Get ATS-optimized formatting, keyword suggestions, and industry-specific improvements.",
    tags: ["React", "TypeScript", "Node.js"],
    accent: "from-sky-500 to-blue-600",
    accentText: "text-sky-400",
    accentBg: "bg-sky-500/10",
    accentBorder: "border-sky-500/30",
  },
  {
    id: "matching",
    number: "B",
    title: "Smart Job Matching",
    description:
      "Find opportunities that truly match your skills. Our AI analyzes thousands of listings to surface your perfect roles.",
    jobs: [
      { title: "Senior Frontend Dev", company: "Google", match: 95 },
      { title: "Full Stack Engineer", company: "Meta", match: 92 },
      { title: "React Developer", company: "Stripe", match: 89 },
    ],
    accent: "from-emerald-500 to-teal-600",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
  },
  {
    id: "alerts",
    number: "C",
    title: "Real-time Job Alerts",
    description:
      "Never miss an opportunity. Get instant notifications when jobs matching your criteria are posted.",
    alerts: [
      { message: "5 new Frontend jobs in San Francisco", time: "2m ago" },
      { message: "Perfect match: Senior React Dev at Stripe", time: "15m ago" },
      { message: "Your saved job updated requirements", time: "1h ago" },
    ],
    accent: "from-amber-500 to-orange-600",
    accentText: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
  },
  {
    id: "global",
    number: "D",
    title: "Global Opportunities",
    description:
      "Access job markets worldwide. Whether remote or on-site, find opportunities across continents.",
    accent: "from-violet-500 to-purple-600",
    accentText: "text-violet-400",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/30",
  },
];

function FeatureVisual({ feature }) {
  if (feature.id === "resume") {
    return (
      <div className="relative rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-full bg-sky-500/20 border border-sky-500/30" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded bg-foreground/10" />
            <div className="h-2.5 w-20 rounded bg-foreground/5" />
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-sky-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">AI Enhanced</span>
          </div>
        </div>
        <div className="space-y-2 border-t border-border pt-4">
          <div className="h-2.5 w-full rounded bg-foreground/8" />
          <div className="h-2.5 w-5/6 rounded bg-foreground/5" />
          <div className="h-2.5 w-4/6 rounded bg-foreground/5" />
        </div>
        <div className="flex gap-2 mt-4">
          {feature.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-sky-500/10 border border-sky-500/20 px-2 py-1 text-[10px] font-bold text-sky-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (feature.id === "matching") {
    return (
      <div className="space-y-3">
        {feature.jobs.map((job, i) => (
          <motion.div
            key={job.title}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3 backdrop-blur-sm"
          >
            <div>
              <p className="text-sm font-bold text-foreground">{job.title}</p>
              <p className="text-xs text-muted-foreground">{job.company}</p>
            </div>
            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-400">
              {job.match}%
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (feature.id === "alerts") {
    return (
      <div className="space-y-3">
        {feature.alerts.map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Bell className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Global - abstract globe representation
  return (
    <div className="relative flex h-48 items-center justify-center">
      <div className="absolute h-36 w-36 rounded-full border border-violet-500/20" />
      <div className="absolute h-28 w-28 rounded-full border border-violet-500/30" />
      <div className="absolute h-20 w-20 rounded-full border border-violet-500/40 bg-violet-500/5" />
      <Globe className="h-8 w-8 text-violet-400" />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-violet-400"
          style={{
            top: `${20 + Math.sin(i * 1.3) * 35 + 35}%`,
            left: `${15 + Math.cos(i * 1.7) * 35 + 35}%`,
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

export default function FeaturesSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-7xl py-24 lg:py-36">
      {/* Header */}
      <div className="mb-20 px-4 sm:px-8">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70"
        >
          002 — Platform
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
        >
          Built different.
          <br />
          <span className="text-muted-foreground/40">Built for you.</span>
        </motion.h2>
      </div>

      {/* Feature rows - alternating layout */}
      <div className="relative">
        {/* Progress rail */}
        <div className="absolute left-4 top-0 bottom-0 hidden w-px bg-border lg:left-8 lg:block">
          <motion.div
            style={{ height: progressHeight }}
            className="w-px bg-primary"
          />
        </div>

        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Node on rail */}
              <div className="absolute -left-4 top-2 z-10 hidden lg:-left-8 lg:block">
                <div className={cn(
                  "flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-background",
                  feature.accentBorder
                )}>
                  <div className={cn("h-1.5 w-1.5 rounded-full bg-gradient-to-r", feature.accent)} />
                </div>
              </div>

              <div className={cn(
                "grid items-center gap-10 lg:grid-cols-2 lg:gap-20",
                index % 2 === 1 && "lg:direction-rtl"
              )}>
                {/* Text side */}
                <div className={cn(index % 2 === 1 && "lg:order-2")}>
                  <span className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-black",
                    feature.accentText,
                    feature.accentBg,
                    feature.accentBorder
                  )}>
                    {feature.number}
                  </span>
                  <h3 className="mt-5 text-2xl font-black tracking-tight text-foreground md:text-4xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                {/* Visual side */}
                <div className={cn(index % 2 === 1 && "lg:order-1")}>
                  <FeatureVisual feature={feature} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ children, className, index }) {
  return null; // kept for compatibility
}

function FeatureTitle({ children }) {
  return null;
}

function FeatureDescription({ children }) {
  return null;
}

// Re-export the new DarkGridFeatures component as AdditionalFeatures
export { default as AdditionalFeatures } from "./dark-grid-features";
