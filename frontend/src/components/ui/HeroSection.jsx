import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import WorldMap from "./WorldMap";
import { AnimatedGradientText, AnimatedLetters } from "./AnimatedText";
import FeaturesCard from "./FeaturesCard";

const worldMapDots = [
  {
    start: { lat: 64.2008, lng: -149.4937 }, // Alaska
    end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  },
  {
    start: { lat: 64.2008, lng: -149.4937 }, // Alaska
    end: { lat: -15.7975, lng: -47.8919 }, // Brazil
  },
  {
    start: { lat: -15.7975, lng: -47.8919 }, // Brazil
    end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
  },
  {
    start: { lat: 51.5074, lng: -0.1278 }, // London
    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  },
  {
    start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    end: { lat: -33.8688, lng: 151.2093 }, // Sydney
  },
  {
    start: { lat: 40.7128, lng: -74.006 }, // New York
    end: { lat: 51.5074, lng: -0.1278 }, // London
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects - Premium Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Career Acceleration
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-8xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="block"
            >
              Land your dream job
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="block"
            >
              with{" "}
              <span className="gradient-text">careerpilot</span>
            </motion.span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The intelligent job search platform that enhances your resume with AI,
            matches you with perfect opportunities, and tracks your applications—all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/25 overflow-hidden"
            >
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-card hover:bg-muted text-foreground font-bold rounded-2xl transition-all duration-300 backdrop-blur-sm"
            >
              Explore Jobs
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-20 mt-20 pt-10 border-t border-border"
          >
            {[
              { value: "10K+", label: "Active Jobs" },
              { value: "95%", label: "ATS Success" },
              { value: "2.5x", label: "Faster Hiring" },
              { value: "50K+", label: "Users" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors">{stat.value}</div>
                <div className="text-sm font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* World Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-24 relative"
        >
          <div className="text-center mb-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Global{" "}
              <span className="text-primary">
                Connectivity
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mt-4 font-medium">
              Connect with opportunities worldwide. Work remotely from anywhere
              or find on-site roles across continents.
            </p>
          </div>

          <div className="relative p-1 rounded-[2rem] border border-border bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />
            <div className="relative p-4">
              <WorldMap dots={worldMapDots} lineColor="var(--primary)" />
            </div>
          </div>
        </motion.div>
        <FeaturesCard />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}

