import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Search,
  Sparkles,
  Briefcase,
  BarChart3,
  Bell,
  Users,
  FileText,
  Zap
} from "lucide-react";
import Globe from "./Globe";

function SkeletonOne() {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-muted shadow-2xl group h-full rounded-2xl border border-border">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          {/* Resume preview mockup */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-foreground/10 rounded w-32" />
                <div className="h-3 bg-foreground/5 rounded w-24" />
              </div>
              <div className="flex gap-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs text-primary font-bold uppercase tracking-wider">AI Enhanced</span>
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="h-3 bg-foreground/10 rounded w-full" />
              <div className="h-3 bg-foreground/5 rounded w-5/6" />
              <div className="h-3 bg-foreground/5 rounded w-4/6" />
            </div>
            <div className="flex gap-2 pt-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 tracking-tight">React</span>
              <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20 tracking-tight">TypeScript</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 tracking-tight">Node.js</span>
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="h-3 bg-foreground/10 rounded w-full" />
              <div className="h-3 bg-foreground/5 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-background via-background to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-background via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
}

function SkeletonTwo() {
  const jobs = [
    { title: "Senior Frontend Dev", company: "Google", match: 95 },
    { title: "Full Stack Engineer", company: "Meta", match: 92 },
    { title: "React Developer", company: "Stripe", match: 89 },
    { title: "Software Engineer", company: "Vercel", match: 87 },
    { title: "UI Engineer", company: "Linear", match: 85 },
  ];

  return (
    <div className="relative flex flex-col items-start p-4 gap-2 h-full overflow-hidden">
      {jobs.map((job, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="w-full p-3 bg-muted rounded-xl border border-border hover:border-primary transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground font-bold">{job.title}</p>
              <p className="text-xs text-muted-foreground font-medium">{job.company}</p>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-bold">{job.match}%</span>
            </div>
          </div>
        </motion.div>
      ))}
      <div className="absolute left-0 z-[100] inset-y-0 w-10 bg-gradient-to-r from-background to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-10 bg-gradient-to-l from-background to-transparent h-full pointer-events-none" />
      <div className="absolute bottom-0 z-[100] inset-x-0 h-20 bg-gradient-to-t from-background to-transparent w-full pointer-events-none" />
    </div>
  );
}

function SkeletonThree() {
  const alerts = [
    { type: "new", message: "5 new Frontend jobs in San Francisco", time: "2m ago" },
    { type: "match", message: "Perfect match: Senior React Dev at Stripe", time: "15m ago" },
    { type: "update", message: "Your saved job updated requirements", time: "1h ago" },
  ];

  return (
    <div className="relative flex flex-col gap-3 p-4 h-full">
      {alerts.map((alert, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.15 }}
          className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border shadow-sm"
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            alert.type === "new" && "bg-primary/10",
            alert.type === "match" && "bg-primary/10",
            alert.type === "update" && "bg-secondary/10"
          )}>
            <Bell className={cn(
              "w-4 h-4",
              alert.type === "new" && "text-primary",
              alert.type === "match" && "text-primary",
              alert.type === "update" && "text-secondary"
            )} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground font-semibold leading-tight">{alert.message}</p>
            <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SkeletonFour() {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Resume Enhancement",
    description:
      "Transform your resume with cutting-edge AI. Get ATS-optimized formatting, keyword suggestions, and industry-specific improvements.",
    skeleton: <SkeletonOne />,
    className: "col-span-1 lg:col-span-4 border-b lg:border-r border-border",
  },
  {
    title: "Smart Job Matching",
    description:
      "Find opportunities that truly match your skills. Our AI analyzes thousands of listings to surface your perfect roles.",
    skeleton: <SkeletonTwo />,
    className: "border-b col-span-1 lg:col-span-2 border-border",
  },
  {
    title: "Real-time Job Alerts",
    description:
      "Never miss an opportunity. Get instant notifications when jobs matching your criteria are posted.",
    skeleton: <SkeletonThree />,
    className: "col-span-1 lg:col-span-3 lg:border-r border-border",
  },
  {
    title: "Global Opportunities",
    description:
      "Access job markets worldwide. Whether remote or on-site, find opportunities across continents.",
    skeleton: <SkeletonFour />,
    className: "col-span-1 lg:col-span-3 border-b lg:border-none border-border",
  },
];

export default function FeaturesSection() {
  return (
    <div className="relative py-20 lg:py-32 max-w-7xl mx-auto">
      <div className="px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-6xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-black text-foreground"
        >
          Everything you need to{" "}
          <span className="text-primary underline decoration-primary/20 underline-offset-8">
            accelerate
          </span>{" "}
          your career
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base lg:text-lg max-w-2xl my-6 mx-auto text-muted-foreground text-center font-medium"
        >
          From AI resume optimization to global job search, careerpilot provides
          the tools you need to land your dream job faster.
        </motion.p>
      </div>

      <div className="relative mt-12 ">
        <div className="grid grid-cols-1 lg:grid-cols-6 border rounded-[2.5rem] border-border bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} className={feature.className} index={index}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ children, className, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn("p-6 sm:p-10 relative overflow-hidden group hover:bg-muted/50 transition-colors duration-500", className)}
    >
      {children}
    </motion.div>
  );
}

function FeatureTitle({ children }) {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-foreground text-xl md:text-3xl md:leading-snug font-black">
      {children}
    </p>
  );
}

function FeatureDescription({ children }) {
  return (
    <p className="text-base md:text-lg max-w-4xl text-left mx-auto text-muted-foreground font-medium my-3">
      {children}
    </p>
  );
}

// Re-export the new DarkGridFeatures component as AdditionalFeatures
export { default as AdditionalFeatures } from "./dark-grid-features";