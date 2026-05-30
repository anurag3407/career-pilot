import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Testimonials() {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-950">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-5xl w-full"
      >
        {/* Section title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Testimonials
            </span>
            <span className="text-gray-600 ml-4">/</span>
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Card */}
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 rounded-xl p-8 transition-all duration-300 h-full flex flex-col">
                {/* Stars */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-1 mb-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                    >
                      <Star size={18} className="fill-cyan-400 text-cyan-400" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Quote */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-300 italic leading-relaxed mb-6 flex-grow text-lg"
                >
                  "{testimonial.text}"
                </motion.p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-700/30">
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400/50 flex-shrink-0"
                  >
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Author info */}
                  <div>
                    <p className="font-semibold text-gray-100">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>

                {/* Quotation mark decoration */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-4 right-4 text-6xl font-black text-cyan-400/10"
                >
                  "
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials count */}
        <motion.div variants={itemVariants} className="mt-16 pt-12 border-t border-gray-700/30 text-center">
          <p className="text-gray-400">
            <span className="text-cyan-400 font-semibold text-2xl">{data.testimonials.length}</span>{' '}
            <span>Trusted by Industry Leaders</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
