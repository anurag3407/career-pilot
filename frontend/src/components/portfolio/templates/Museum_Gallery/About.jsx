import React from 'react';

import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 

  Sparkles
} from 'lucide-react';

const About = ({data}) => {
  const { personal, stats, socials } = data;
  
  return (
    <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-amber-100 to-amber-200 relative overflow-hidden ">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-300 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 " />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-300 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 " />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10 ">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
            <Sparkles className="w-6 h-6 text-amber-600" />
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-16 text-center font-serif tracking-tight">
            About the Artist
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center  m-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl transform -rotate-3 shadow-2xl" />
              <div className="absolute -inset-2 bg-amber-100 rounded-xl" />
              <div className="relative bg-white border-4 border-amber-600 rounded-xl p-8 shadow-xl">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <p className="text-m md:text-xl text-gray-700 leading-relaxed font-serif">
                  {personal.bio}
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 md:gap-6"
            >
              {[
                { label: 'Years Experience', value: stats?.yearsExperience || '5+', icon: '⭐' },
                { label: 'Projects Completed', value: stats?.projectsCompleted || '50+', icon: '🎨' },
                { label: 'Happy Clients', value: stats?.happyClients || '30+', icon: '😊' },
                { label: 'Awards Won', value: '10+', icon: '🏆' },
                { label: 'Technologies', value: '25+', icon: '⚡' },
                { label: 'Coffee Cups', value: '1000+', icon: '☕' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white border-3 border-amber-600 rounded-l p-4 md:p-5 text-center shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="text-2l md:text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2l md:text-3xl font-bold text-amber-600 font-serif mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 font-serif">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-6 md:gap-8 mt-16"
          >
            {[
              { icon: Github, url: socials?.github, label: 'GitHub' },
              { icon: Linkedin, url: socials?.linkedin, label: 'LinkedIn' },
              { icon: Twitter, url: socials?.twitter, label: 'Twitter' },
              { icon: Mail, url: socials?.email ? `mailto:${socials.email}` : '#', label: 'Email' }
            ].map((social, index) => social.url && social.url !== '#' && (
              <motion.a
                key={social.label}
                href={social.url}
                target={social.label !== 'Email' ? '_blank' : undefined}
                rel={social.label !== 'Email' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.2, y: -5 }}
                className="w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-amber-600 rounded-full flex items-center justify-center text-amber-700 hover:bg-amber-600 hover:text-white hover:border-amber-700 transition-all shadow-lg"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6 md:w-7 md:h-7" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;