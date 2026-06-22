import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function FeatureLandingHero({
  badgeText = "NEW FEATURE",
  title = "Supercharge Your",
  accentText = "Career Path",
  description = "The most advanced AI tools to help you build, optimize, and land your dream job faster than ever before.",
  primaryCtaText = "Get Started Free",
  secondaryCtaText = "Watch Demo",
  primaryCtaLink = "/register",
  secondaryCtaLink = "#demo",
  stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Success Rate", value: "95%" },
    { label: "Time Saved", value: "10x" }
  ],
  illustration = null
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 text-foreground lg:pt-36 lg:pb-40">
      {/* Background Parallax Blobs */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform">
        <div className="absolute top-0 left-[-200px] h-[400px] w-[400px] rounded-full bg-primary/30 blur-[100px] animate-blob" />
        <div className="absolute top-[100px] left-[200px] h-[300px] w-[300px] rounded-full bg-secondary/30 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[200px] left-[0px] h-[350px] w-[350px] rounded-full bg-primary/20 blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-8"
          >
            <motion.div variants={itemVariants} className="flex">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                {badgeText}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                {title} <br className="hidden sm:block" />
                <span className="gradient-text">
                  {accentText}
                </span>
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl leading-relaxed">
                {description}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                to={primaryCtaLink}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/50 hover:-translate-y-0.5"
              >
                {primaryCtaText}
              </Link>
              <a
                href={secondaryCtaLink}
                className="inline-flex items-center justify-center rounded-xl bg-card/50 px-8 py-4 text-base font-semibold text-foreground ring-1 ring-inset ring-border backdrop-blur-sm transition-all hover:bg-card hover:text-foreground"
              >
                <Play className="mr-2 h-5 w-5" />
                {secondaryCtaText}
              </a>
            </motion.div>

            {/* Stats Strip */}
            {stats && stats.length > 0 && (
              <motion.div variants={itemVariants} className="pt-8 border-t border-border mt-8">
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">
                        {stat.value}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground mt-1">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Content / Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl -z-10 rounded-[3rem]" />
            {illustration ? (
              illustration
            ) : (
              <div className="h-[500px] w-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm flex items-center justify-center shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-12 border-b border-border bg-background/50 flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-muted-foreground font-medium">Interactive App Preview</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
