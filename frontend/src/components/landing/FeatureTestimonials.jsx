import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FeatureTestimonials({
  heading = "Loved by professionals",
  subheading = "See how our tools have helped others land their dream roles.",
  testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Product Manager at TechCorp",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      quote: "The AI optimization completely transformed my resume. I went from getting ghosted to landing 5 interviews in one week.",
      metric: "3x Interview Rate",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Frontend Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      quote: "Building my portfolio took minutes instead of days. The recruiter specifically mentioned how professional it looked.",
      metric: "Hired in 2 Weeks",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      quote: "The mock interviews were incredibly realistic. The feedback on my body language helped me fix habits I didn't even know I had.",
      metric: "95% Confidence Score",
      rating: 5
    }
  ]
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
  };

  return (
    <section className="bg-background py-24 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {heading}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {subheading}
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col bg-card/50 border border-border rounded-3xl p-8 backdrop-blur-sm relative group hover:border-primary/50 hover:bg-card transition-colors"
            >
              {/* Optional glowing top border effect */}
              <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-foreground text-lg leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>

              {/* Metric Highlight (if any) */}
              {testimonial.metric && (
                <div className="mb-6 inline-flex items-center rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400 border border-emerald-500/20 w-fit">
                  {testimonial.metric}
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full bg-muted border-2 border-border"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
