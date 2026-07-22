import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const SocialIcon = ({ href, icon }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="p-4 bg-zinc-900 text-white rounded-full flex items-center justify-center"
    whileHover={{ scale: 1.2, rotate: 15, y: -5, backgroundColor: "#4f46e5", boxShadow: "0px 15px 25px rgba(79, 70, 229, 0.4)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
    whileTap={{ scale: 0.8, transition: { type: "spring", stiffness: 600, damping: 15 } }}
  >
    {icon}
  </motion.a>
);

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24">
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] md:w-[60vw] h-[120vw] md:h-[60vw] bg-indigo-500/10 blur-[100px] -z-10"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360], borderRadius: ["30%", "50%", "30%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left z-10">
          <motion.div initial={{ opacity: 0, y: 100, rotateX: 45 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}>
            <h1 className="text-6xl md:text-8xl font-black text-zinc-900 mb-6 tracking-tighter">{data.personal.name}</h1>
            <p className="text-xl md:text-3xl text-zinc-600 font-medium mb-8">{data.personal.title}</p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {data.socials.github && <SocialIcon href={data.socials.github} icon={<Github />} />}
              {data.socials.linkedin && <SocialIcon href={data.socials.linkedin} icon={<Linkedin />} />}
              {data.socials.twitter && <SocialIcon href={data.socials.twitter} icon={<Twitter />} />}
            </div>
          </motion.div>
        </div>
        <div className="flex-1 flex justify-center z-10" style={{ perspective: 1200 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.1, rotateX: 180, rotateZ: -45, y: 400 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, rotateZ: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 10, mass: 1.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, rotateY: -15, rotateX: 10, rotateZ: 2, z: 50, transition: { type: "spring", stiffness: 500, damping: 15 } }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-400"
              animate={{ borderRadius: ["40% 60% 60% 40%", "60% 40% 40% 60%", "40% 60% 60% 40%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(-20px)" }}
            />
            <img src={data.personal.avatar} alt={data.personal.name} className="relative w-64 h-64 md:w-96 md:h-96 object-cover border-4 border-white shadow-2xl p-2 bg-white" style={{ borderRadius: 'inherit', transform: "translateZ(20px)" }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};