import React from 'react';
import { motion } from 'framer-motion';

export default function About({ data = {} }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0ebe6] via-[#faf8f5] to-[#ede7de]" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-gradient-to-r from-[#e8ddd6] to-transparent rounded-full blur-3xl opacity-20" />
      </div>

      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#3e3a37] via-[#8b6f47] to-[#3e3a37] bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#c7a77f] to-[#b8956a] rounded-full" />
        </motion.div>

        {/* Content with ceramic cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Bio Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <motion.div
              whileHover={{ y: -4 }}
              className="p-8 sm:p-10 rounded-3xl backdrop-blur-sm transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(250,248,245,0.5) 100%)',
                boxShadow: '0 15px 50px rgba(199, 167, 127, 0.12), inset 0 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              <div className="space-y-6 text-lg sm:text-lg text-[#5a4f47] leading-relaxed font-light">
                <p>
                  {data.bio}
                </p>

                {data.location && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 pt-4 border-t border-[#e8ddd6]"
                  >
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-sm text-[#8b6f47] font-medium uppercase tracking-wide">Location</p>
                      <p className="text-lg text-[#3e3a37] font-medium">{data.location}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Highlights */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🎯', title: 'Strategic Thinker', desc: 'Turning complex problems into elegant solutions' },
                { icon: '✨', title: 'Creative Craftsman', desc: 'Building beautiful, performant experiences' },
                { icon: '🚀', title: 'Growth Minded', desc: 'Always learning and pushing boundaries' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(199, 167, 127, 0.2)' }}
                  className="p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 h-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(245,241,237,0.3) 100%)',
                    boxShadow: '0 8px 24px rgba(199, 167, 127, 0.08), inset 0 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-semibold text-[#3e3a37] mb-2 text-base">{item.title}</h4>
                  <p className="text-sm text-[#8b6f47] leading-relaxed font-light">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tagline as emphasis */}
          {data.tagline && (
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2"
            >
              <blockquote
                className="relative p-8 sm:p-10 rounded-3xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(199, 167, 127, 0.08) 0%, rgba(184, 149, 106, 0.04) 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(199, 167, 127, 0.2)'
                }}
              >
                <div className="absolute top-0 left-0 text-6xl text-[#c7a77f] opacity-10 font-serif">"</div>
                <p className="relative z-10 text-xl sm:text-2xl text-[#3e3a37] font-light italic leading-relaxed">
                  {data.tagline}
                </p>
              </blockquote>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

