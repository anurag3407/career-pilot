import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Palette, Target, User, Search, Briefcase, Mic } from 'lucide-react';
import PremiumFeatureCard from './PremiumFeatureCard';

import { FEATURES } from '../../data/featuresConfig';

export default function OurToolsSection() {

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-6"
          >
            Powerful AI Tools for <span className="gradient-text">Every Step</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            From your first resume draft to your final interview, CareerPilot gives you the unfair advantage you need.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={
                feature.size === 'large' ? 'lg:col-span-2' : 
                feature.size === 'medium' ? 'lg:col-span-1' : 
                'lg:col-span-1'
              }
            >
              <PremiumFeatureCard 
                to={`/${feature.slug}`}
                icon={feature.icon}
                title={feature.name}
                description={feature.tagline}
                badge={feature.badge}
                illustration={feature.Illustration ? <feature.Illustration /> : null}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
