import { motion } from "framer-motion";
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

export default function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-40 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-[60%] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center group"
              >
                {/* Step Number */}
                <div className="text-8xl font-black text-muted/30 mb-4 select-none group-hover:text-primary/20 transition-colors">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-full h-full bg-card border border-border rounded-[2rem] flex items-center justify-center shadow-xl group-hover:border-primary/50 group-hover:-translate-y-2 transition-all duration-300">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-[60%] -right-6 transform translate-x-1/2">
                    <ArrowRight className="w-8 h-8 text-border group-hover:text-primary transition-colors" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
