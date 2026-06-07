import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, Calendar } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function About() {
  const { personal } = data;

  return (
    <section id="about" className="py-24 bg-[#001f2d] text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col lg:flex-row items-center gap-16"
        >
          {/* Decorative Image Side */}
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="aspect-square rounded-2xl overflow-hidden border-2 border-[#a3e635]/30 shadow-[0_0_50px_rgba(163,230,53,0.1)]">
                <img
                  src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=1000&q=80"
                  alt="Marine Background"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Stat Card */}
              <motion.div
                className="absolute -bottom-10 -right-10 bg-[#004b63]/80 backdrop-blur-xl border border-[#ff7f50]/30 p-6 rounded-2xl shadow-2xl hidden md:block"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ff7f50]/20 rounded-full flex items-center justify-center text-[#ff7f50]">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Current Role</p>
                    <p className="text-lg font-bold text-white">{personal.title}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Background elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#ff7f50]/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#a3e635]/10 rounded-full blur-[100px]" />
          </div>

          {/* Text Content Side */}
          <div className="lg:w-1/2">
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[#ff7f50] font-mono font-bold tracking-widest uppercase mb-4 block"
            >
              About Me
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Diving Deep into <span className="text-[#a3e635]">Modern Tech</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg leading-relaxed mb-10"
            >
              {personal.bio}
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                { icon: MapPin, label: 'Location', value: personal.location },
                { icon: Calendar, label: 'Experience', value: `${data.stats.yearsExperience}+ Years` },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="text-[#a3e635]">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                    <p className="font-medium text-gray-200">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#ff7f50] text-white rounded-xl font-bold shadow-lg shadow-[#ff7f50]/20 hover:bg-[#ff6347] transition-all"
            >
              Download CV
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
