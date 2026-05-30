import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const Testimonials = ({ data }) => {
  const { testimonials } = data;
  const [current, setCurrent] = useState(0);

  if (!testimonials?.length) return null;

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <div className="inline-block px-6 py-2 bg-purple-500/20 rounded-full mb-4">
          <span className="text-purple-300 font-semibold">🃟 TESTIMONIALS 🃟</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What People Say</h2>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <button onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-500"><ChevronLeft className="w-6 h-6" /></button>
        <button onClick={() => setCurrent((p) => (p + 1) % testimonials.length)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-500"><ChevronRight className="w-6 h-6" /></button>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -90 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <Quote className="w-12 h-12 text-purple-600 mb-6 mx-auto" />
            <p className="text-xl md:text-2xl text-gray-700 italic mb-8">"{testimonials[current].text}"</p>
            <div className="flex items-center justify-center gap-4">
              {testimonials[current].avatar && <img src={testimonials[current].avatar} className="w-16 h-16 rounded-full border-2 border-purple-600" alt={testimonials[current].name} />}
              <div><h4 className="text-lg font-bold text-gray-900">{testimonials[current].name}</h4><p className="text-purple-600">{testimonials[current].role}</p></div>
            </div>
            <div className="flex justify-center gap-1 mt-6">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />)}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Testimonials;