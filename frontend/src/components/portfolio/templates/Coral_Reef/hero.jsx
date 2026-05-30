import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const Bubbles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm"
          style={{
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
            left: `${Math.random() * 100}%`,
            bottom: `-20px`,
          }}
          animate={{
            y: [0, -1000],
            x: [0, Math.sin(i) * 50],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const Fish = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + Math.random() * 60}%`,
          }}
          initial={{ x: '-100px', opacity: 0 }}
          animate={{
            x: ['-100px', '110vw'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 3,
            ease: "linear",
          }}
        >
          <svg width="40" height="20" viewBox="0 0 40 20" fill="currentColor" className="text-[#ff7f50]/40">
            <path d="M0 10 C5 0 15 0 25 5 L40 10 L25 15 C15 20 5 20 0 10 Z" />
            <path d="M35 10 L40 5 L40 15 Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default function Hero() {
  const { personal, socials } = data;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#004b63] to-[#001f2d] pt-20">
      <Bubbles />
      <Fish />
      
      {/* Seaweed Background */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end h-64 pointer-events-none overflow-hidden opacity-30">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 bg-[#a3e635] rounded-t-full"
            style={{ height: `${40 + Math.random() * 60}%` }}
            animate={{
              rotateZ: [-5, 5, -5],
              skewX: [-2, 2, -2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block mb-8">
            <motion.img
              src={personal.avatar}
              alt={personal.name}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[#ff7f50] object-cover shadow-2xl"
              whileHover={{ scale: 1.05 }}
            />
            <motion.div
              className="absolute -inset-2 border-2 border-[#a3e635] rounded-full"
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            I'm <span className="text-[#ff7f50]">{personal.name}</span>
          </h1>
          
          <h2 className="text-xl md:text-3xl text-[#a3e635] font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
            {personal.title}
          </h2>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            {personal.bio}
          </p>

          <div className="flex justify-center gap-6 mb-16">
            {[
              { icon: Github, url: socials.github },
              { icon: Linkedin, url: socials.linkedin },
              { icon: Twitter, url: socials.twitter },
              { icon: Mail, url: `mailto:${socials.email}` },
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-[#ff7f50] hover:text-white transition-all duration-300"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon size={24} />
              </motion.a>
            ))}
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[#a3e635] text-sm font-medium tracking-widest uppercase text-shadow-sm">Explore Reef</span>
            <ChevronDown className="text-[#ff7f50]" size={32} />
          </motion.div>
        </motion.div>
      </div>

      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,183,189,0.1),transparent_70%)] pointer-events-none" />
    </section>
  );
}
