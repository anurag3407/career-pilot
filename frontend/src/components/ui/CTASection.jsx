import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Check } from "lucide-react";

const perks = [
  "No credit card required",
  "Free forever plan",
  "Cancel anytime",
];

export default function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/40 px-6 py-20 text-center shadow-2xl backdrop-blur-xl md:px-16 md:py-28"
        >
          {/* Aurora + grid inside the card */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="aurora-layer aurora-1" />
            <div className="aurora-layer aurora-2" />
            <div className="premium-grid absolute inset-0 opacity-50" />
            <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
            <div className="noise-overlay absolute inset-0 mix-blend-overlay" />
          </div>

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 backdrop-blur-md">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Ready to accelerate?
              </span>
            </div>

            <h2 className="mx-auto max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-foreground md:text-7xl">
              Start your journey to{" "}
              <span className="gradient-text-animated">career success</span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
              Join thousands of professionals who have transformed their job
              search with careerpilot. Free to start, powerful to scale.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-[1.5px] shadow-xl shadow-primary/25 transition-transform duration-300 hover:scale-[1.03]"
              >
                <span className="absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--primary)_25%,var(--secondary)_50%,transparent_75%)] opacity-80" />
                <span className="relative inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-10 py-5 font-black text-primary-foreground">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-border bg-background/50 px-10 py-5 font-black text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-muted"
              >
                Sign In
              </Link>
            </div>

            {/* Perks */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {perks.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
