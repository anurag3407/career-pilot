import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Testimonials() {
  return (
    <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
      <h2 className="text-4xl font-light mb-16 text-center">
        Testimonials
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {data.testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover"
              />

              <div>
                <h3 className="font-medium">
                  {testimonial.name}
                </h3>

                <p className="text-stone-500 text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>

            <div className="flex gap-1 mb-4 text-stone-700">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>

            <p className="text-stone-600 leading-relaxed italic">
              “{testimonial.text}”
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}