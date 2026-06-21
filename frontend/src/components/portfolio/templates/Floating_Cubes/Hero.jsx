import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const Hero = () => (
  <section className="min-h-screen flex items-center justify-center pt-20 relative z-10 px-6">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-center max-w-4xl"
    >
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8 relative inline-block"
      >
        <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full" />
        <img 
          src={data.personal.avatar} 
          alt={data.personal.name || "Profile Avatar"} 
          className="w-40 h-40 object-cover rounded-[2rem] border-2 border-white/30 shadow-2xl relative z-10"
        />
      </motion.div>
      <motion.h1 
        className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight"
        animate={{ filter: ['drop-shadow(0px 0px 0px rgba(0,0,0,0))', 'drop-shadow(0px 5px 15px rgba(192,132,252,0.4))', 'drop-shadow(0px 0px 0px rgba(0,0,0,0))'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {data.personal.name}
      </motion.h1>
      <p className="text-2xl md:text-3xl text-cyan-200 font-light mb-8">
        {data.personal.title}
      </p>
      <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
        {data.personal.bio}
      </p>
      <div className="flex justify-center gap-6">
        {[
          { icon: <Github size={24} />, url: data.socials.github },
          { icon: <Linkedin size={24} />, url: data.socials.linkedin },
          { icon: <Twitter size={24} />, url: data.socials.twitter },
          { icon: <Mail size={24} />, url: `mailto:${data.socials.email}` }
        ].map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="p-4 bg-white/5 border border-white/20 rounded-2xl text-white relative overflow-hidden"
            whileHover={{
              scale: 1.1,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              rotate: 360
            }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
    </motion.div>
  </section>
);

export default Hero;