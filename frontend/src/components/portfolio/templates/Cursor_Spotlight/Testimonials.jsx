import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const Testimonials = ({ testimonials }) => {
  return (
    <section className="relative z-10 mx-auto max-w-5xl py-24 px-6">
      <div className="mb-12 flex items-center gap-4">
        <MessageSquare className="text-blue-500" />
        <h2 className="text-3xl font-bold text-white">Testimonials</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((test, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="flex flex-col justify-between rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-900/10 p-8 backdrop-blur-sm"
          >
            <p className="mb-8 text-sm italic text-zinc-300">"{test.text}"</p>
            <div className="flex items-center gap-4">
              <img src={test.avatar} alt={test.name || "Profile Avatar"} className="h-10 w-10 rounded-full grayscale" />
              <div>
                <h4 className="text-sm font-bold text-white">{test.name}</h4>
                <span className="text-xs text-zinc-500">{test.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;