import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Testimonials() {
  const { testimonials, testimonialsTitle, fallbackAvatar } = data;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="testimonials" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          {testimonialsTitle?.prefix || 'Client'}{' '}
          <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            {testimonialsTitle?.highlight || 'Reviews'}
          </span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="group relative p-8 rounded-3xl bg-gray-900/30 border border-white/5 hover:border-pink-500/30 backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-gray-900/50 hover:shadow-2xl hover:shadow-pink-500/5"
          >
            {/* Quote Icon */}
            <Quote className="absolute right-6 top-6 w-16 h-16 text-white/5 group-hover:text-pink-500/10 group-hover:scale-110 transition-all duration-500 pointer-events-none" />

            {/* Stars (DATA DRIVEN) */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonial.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-pink-500 text-pink-500" />
              ))}
            </div>

            {/* Text */}
            <p className="text-gray-300 text-base italic leading-relaxed mb-8 relative z-10">
              "{testimonial.text}"
            </p>

            {/* Client Info */}
            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5 relative z-10">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 group-hover:border-pink-500/40 transition-colors">
                <img
                  src={testimonial.avatar || fallbackAvatar}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-bold text-white group-hover:text-pink-400 transition-colors">
                  {testimonial.name}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
