import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function About() {
  return (
    <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <img
            src={data.personal.avatar}
            alt={data.personal.name}
            className="rounded-3xl shadow-lg object-cover w-full max-w-md mx-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light mb-8">About</h2>

          <p className="text-stone-600 leading-relaxed text-lg mb-8">
            {data.personal.bio}
          </p>

          <div className="flex items-center gap-3 text-stone-500">
            <MapPin size={18} />
            <span>{data.personal.location}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}