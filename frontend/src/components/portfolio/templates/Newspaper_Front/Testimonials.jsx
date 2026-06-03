import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function Testimonials({ data }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl md:text-3xl font-black text-yellow-600 mb-4 tracking-wider border-l-4 border-yellow-600 pl-4" style={{ fontFamily: 'Georgia, serif' }}>
        TESTIMONIALS
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {data.testimonials.map((testimonial, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-stone-800 border-2 border-yellow-600 p-4 md:p-6 hover:shadow-lg transition"
          >
            <div className="flex gap-3 mb-3">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="w-12 h-12 rounded-full border-2 border-yellow-600 object-cover"
              />
              <div className="flex-1">
                <h4 className="font-black text-yellow-500 text-sm">{testimonial.name}</h4>
                <p className="text-gray-500 text-xs">{testimonial.role}</p>
              </div>
            </div>
            <MessageSquare className="text-yellow-600 mb-2" size={18} />
            <p className="text-gray-400 text-sm italic leading-relaxed">"{testimonial.text}"</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
