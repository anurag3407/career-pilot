import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Code2, Briefcase, Coffee, Music } from 'lucide-react';

const serverIcons = [
  { icon: Code2, color: 'from-indigo-500 to-purple-600', label: 'Dev' },
  { icon: Briefcase, color: 'from-green-500 to-emerald-600', label: 'Work' },
  { icon: Gamepad2, color: 'from-red-500 to-pink-600', label: 'Fun' },
  { icon: Coffee, color: 'from-amber-500 to-orange-600', label: 'Chill' },
  { icon: Music, color: 'from-cyan-500 to-blue-600', label: 'Music' },
];

export default function ServerSidebar({ avatar, name, forceShow = false }) {
  return (
    <div className={`${forceShow ? 'flex' : 'hidden md:flex'} flex-col items-center w-[72px] min-w-[72px] bg-[#1E1F22] py-3 gap-2 overflow-y-auto select-none`}>
      {/* Home Server Icon */}
      <motion.div
        whileHover={{ borderRadius: '35%' }}
        className="w-12 h-12 rounded-[50%] overflow-hidden cursor-pointer mb-1 ring-2 ring-[#5865F2] transition-all duration-200"
      >
        <img src={avatar} alt={name || "Profile Avatar"} className="w-full h-full object-cover" />
      </motion.div>

      <div className="w-8 h-[2px] bg-[#35363C] rounded-full mb-1" />

      {serverIcons.map((s, i) => (
        <motion.div
          key={i}
          whileHover={{ borderRadius: '35%', scale: 1.05 }}
          className={`w-12 h-12 rounded-[50%] bg-gradient-to-br ${s.color} flex items-center justify-center cursor-pointer transition-all duration-200`}
          title={s.label}
        >
          <s.icon className="w-5 h-5 text-white" />
        </motion.div>
      ))}

      {/* Add Server */}
      <motion.div
        whileHover={{ borderRadius: '35%', backgroundColor: '#3BA55D' }}
        className="w-12 h-12 rounded-[50%] bg-[#313338] flex items-center justify-center cursor-pointer text-[#3BA55D] hover:text-white transition-all duration-200 mt-1"
      >
        <span className="text-2xl font-light">+</span>
      </motion.div>
    </div>
  );
}
