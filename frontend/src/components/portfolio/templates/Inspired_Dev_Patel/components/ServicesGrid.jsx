import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Server, Database, AppWindow, Globe, Users, Box, Code } from 'lucide-react';

const ServicesGrid = ({ theme }) => {
  const services = [
    { id: 1, title: "AI & Automation", icon: Layout },
    { id: 2, title: "ERP & CRM Systems", icon: Server },
    { id: 3, title: "Custom .NET Development", icon: Box },
    { id: 4, title: "Enterprise Solutions", icon: Users },
    { id: 5, title: "AI Chatbots for Websites", icon: AppWindow },
    { id: 6, title: "API Development & Integration", icon: Code },
    { id: 7, title: "Web Development", icon: Globe },
    { id: 8, title: "Database Design", icon: Database }
  ];

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={itemVars} className="p-8 sm:p-10 rounded-[32px] shadow-lg w-full" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }} id="services">
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white leading-tight">
          I deliver custom .NET solutions that solve real business problems - from automation to scalable web applications
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <motion.div 
              key={svc.id}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer group transition-all"
              style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-transparent border border-blue-500/20 group-hover:border-blue-500 transition-colors">
                 <Icon size={28} className="text-[#4770FF]" strokeWidth={1.5} />
              </div>
              <span className="font-bold text-sm text-center text-slate-300 group-hover:text-white transition-colors">
                {svc.title}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ServicesGrid;
