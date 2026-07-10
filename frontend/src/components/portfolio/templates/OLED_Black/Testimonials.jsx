import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { SectionHeading } from './shared';

const Testimonials = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((previousIndex) => (previousIndex + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24">
      <SectionHeading title="Telemetry" icon={MessageSquare} />
      <div className="relative flex min-h-[300px] items-center overflow-hidden border border-gray-800 bg-gradient-to-br from-black to-zinc-950 p-8 md:p-12">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <span className="absolute left-6 top-4 z-0 font-serif text-6xl text-gray-800 opacity-50">"</span>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <p className="relative z-10 mb-8 text-xl font-light italic leading-relaxed text-gray-300 md:text-3xl">
              {testimonials[activeIndex].text}
            </p>
            <div className="relative z-10 flex items-center gap-4">
              <img
                src={testimonials[activeIndex].avatar}
                alt={testimonials[activeIndex].name}
                className="h-12 w-12 rounded-full border border-cyan-500/30 grayscale"
              />
              <div>
                <h4 className="font-medium text-white">{testimonials[activeIndex].name}</h4>
                <p className="font-mono text-sm text-cyan-400/70">{testimonials[activeIndex].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 right-8 z-10 flex gap-2">
          {testimonials.map((_, index) => (
            <button type="button"
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1 transition-all duration-300 ${activeIndex === index ? 'w-8 bg-cyan-400' : 'w-2 bg-gray-700 hover:bg-gray-500'}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;