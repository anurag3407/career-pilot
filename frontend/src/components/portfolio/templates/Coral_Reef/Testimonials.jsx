import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Testimonials() {
  const { testimonials } = data;

  return (
    <section id="testimonials" className="py-24 bg-[#001f2d] text-white relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#ff7f50]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#a3e635]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#ff7f50] font-mono font-bold tracking-widest uppercase mb-4 block"
          >
            Kind Words
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            What People <span className="text-[#a3e635]">Say</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#ff7f50] rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Quote size={24} />
              </div>
              
              <div className="flex gap-1 mb-6 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#a3e635] text-[#a3e635]" />
                ))}
              </div>

              <p className="text-gray-300 italic mb-8 leading-relaxed">
                "{item.text}"
              </p>

              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full border-2 border-[#ff7f50] object-cover"
                />
                <div>
                  <h4 className="font-bold text-white">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
