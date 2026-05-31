
import React from 'react';

import { motion } from 'framer-motion';
import { 
  Quote,
} from 'lucide-react';

const Testimonials = ({data}) => {
  const { testimonials } = data;
  
  
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-amber-400 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-yellow-400 rounded-full blur-3xl opacity-20" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
            <Quote className="w-6 h-6 text-amber-600" />
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-4 font-serif tracking-tight">
            Collector's Words
          </h2>
          <p className="text-lg text-amber-700 font-serif italic">Testimonials from Esteemed Clients</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.03, y: -8 }}
              className="bg-white border-3 border-amber-600 rounded-xl p-8 shadow-xl relative group hover:shadow-2xl transition-all"
            >
              {/* Large quote icon */}
              <Quote className="absolute top-4 right-4 w-10 h-10 text-amber-200 group-hover:text-amber-300 transition-colors" />
              
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />
              
              <div className="relative z-10">
                <p className="text-gray-700 mb-6 italic font-serif text-base md:text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-4">
                  {testimonial.avatar && (
                    <div className="w-14 h-14 rounded-full border-3 border-amber-600 overflow-hidden bg-gradient-to-br from-amber-100 to-yellow-100 shadow-lg">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-amber-900 text-lg font-serif">{testimonial.name}</p>
                    <p className="text-sm text-amber-700 font-serif italic">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;