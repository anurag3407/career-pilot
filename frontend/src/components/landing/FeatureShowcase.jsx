import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Layout, Zap, Shield, Sparkles } from 'lucide-react';

export default function FeatureShowcase({
  heading = "Everything you need to succeed",
  subheading = "Powerful features designed to help you stand out and land more interviews.",
  features = [
    {
      title: "AI-Powered Optimization",
      description: "Our advanced models analyze your content and suggest improvements based on real hiring data.",
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      className: "md:col-span-2 md:row-span-2",
    },
    {
      title: "Lightning Fast",
      description: "Generate beautiful results in seconds, not hours.",
      icon: <Zap className="h-6 w-6 text-amber-400" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Beautiful Templates",
      description: "Stand out with premium, recruiter-approved designs.",
      icon: <Layout className="h-6 w-6 text-pink-400" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Privacy First",
      description: "Your data is encrypted and never shared without permission.",
      icon: <Shield className="h-6 w-6 text-emerald-400" />,
      className: "md:col-span-2 md:row-span-1",
    }
  ]
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  return (
    <section className="bg-background py-24 sm:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 top-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background/0 to-background/0 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4 relative inline-block">
            {heading}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {subheading}
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] max-w-6xl mx-auto"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={cn(
                "group relative rounded-3xl border border-border bg-card/50 p-8 backdrop-blur-md overflow-hidden transition-all duration-300",
                "hover:border-primary/50 hover:bg-card hover:shadow-2xl hover:-translate-y-1",
                feature.className
              )}
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 opacity-0 group-hover:from-primary/5 group-hover:to-secondary/10 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted ring-1 ring-border group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  {feature.description}
                </p>
                
                {/* Optional Illustration Area */}
                <div className="mt-auto pt-8 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Decorative elements or screenshots can go here */}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
