import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 lg:py-44 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 via-background to-background" />
      
      {/* Glow Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card shadow-sm mb-10 group hover:border-primary/30 transition-all">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Ready to accelerate?</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-foreground mb-8 leading-[1.1] tracking-tight">
            Start your journey to{" "}
            <span className="text-primary underline decoration-primary/20 underline-offset-8">
              career success
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of professionals who have transformed their job search with careerpilot. 
            Free to start, powerful to scale.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/20 hover:-translate-y-1"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-border text-foreground font-black rounded-2xl hover:bg-muted transition-all duration-300 hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>

          <p className="text-sm font-bold text-muted-foreground mt-10 uppercase tracking-widest opacity-60">
            No credit card required • Free forever plan available
          </p>
        </motion.div>
      </div>
    </section>
  );
}
