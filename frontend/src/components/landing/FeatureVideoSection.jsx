import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FeatureVideoSection({
  heading = "See it in action",
  subheading = "Watch how our tools can transform your workflow in minutes.",
  videoUrl = "", // Empty means placeholder
  posterUrl = "",
  caption = "A quick 2-minute walkthrough of the core features."
}) {
  return (
    <section className="bg-background py-24 sm:py-32 relative z-10">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {heading}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
          >
            {subheading}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden bg-card border border-border"
        >
          {/* Gradient Glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary to-secondary opacity-30 blur-sm" />
          
          <div className="relative z-10 flex flex-col w-full bg-card rounded-xl lg:rounded-2xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="h-10 border-b border-border bg-background flex items-center px-4 space-x-2">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="mx-auto flex-1 flex justify-center">
                <div className="h-5 w-48 bg-muted rounded-full" />
              </div>
            </div>

            {/* Video Container (16:9) */}
            <div className="relative w-full aspect-video bg-muted/50 flex items-center justify-center overflow-hidden">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  title="Product Demo"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center group cursor-pointer">
                  {posterUrl && (
                    <img src={posterUrl} alt="Video poster" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
                  )}
                  <div className="absolute inset-0 bg-card/20 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-300" />
                  
                  {/* Play Button */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/20 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                  </div>
                  
                  {/* Overlay text */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-foreground/80 font-medium text-sm tracking-wide group-hover:opacity-0 transition-opacity">
                    Watch Demo
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {caption && (
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            {caption}
          </motion.p>
        )}
      </div>
    </section>
  );
}
