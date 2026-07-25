import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const perks = [
  "No credit card required",
  "Free forever plan",
  "Cancel anytime",
];

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-32 lg:py-48">
      {/* Massive background text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="select-none whitespace-nowrap text-[20vw] font-black leading-none text-foreground/[0.02]">
          CAREERPILOT
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">
            008 — Start
          </span>

          <h2 className="mt-6 text-5xl font-black leading-[0.9] tracking-tighter text-foreground md:text-8xl">
            Your career
            <br />
            <span className="text-muted-foreground/30">deserves better.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-lg text-lg font-medium leading-relaxed text-muted-foreground">
            Join thousands of professionals who have transformed their job search. Free to start, powerful to scale.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center gap-3 rounded-xl bg-foreground px-10 py-5 text-base font-black text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-xl border border-border px-10 py-5 text-base font-black text-foreground transition-all duration-300 hover:border-foreground/40"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {perks.map((p) => (
              <span key={p} className="text-sm font-medium text-muted-foreground/60">
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
