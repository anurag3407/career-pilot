import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const Testimonials = ({ theme }) => {
  const reviews = [
    {
      id: 1,
      text: "Dev quickly understood our requirements and delivered a flawless application. His .NET expertise and attention to detail are outstanding.",
      author: "Riya Mehta",
      role: "Project Manager"
    },
    {
      id: 2,
      text: "Working with Dev was a game-changer. His ability to translate complex ideas into clean, efficient code, paired with compelling content, elevated our project beyond expectations.",
      author: "Samantha T.",
      role: "CTO at FinanceGo"
    }
  ];

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={itemVars} className="p-8 sm:p-10 rounded-[32px] shadow-lg w-full" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <h2 className="text-3xl font-extrabold text-white max-w-xl leading-tight">
          Turning Concepts into Reality with Code and Creativity
        </h2>
        <div className="flex gap-2">
          <button className="p-3 rounded-xl transition-colors hover:bg-white/10" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
            <ArrowLeft size={20} className="text-white" />
          </button>
          <button className="p-3 rounded-xl transition-colors hover:bg-white/10" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
            <ArrowRight size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div 
            key={rev.id} 
            className="p-8 rounded-2xl flex flex-col justify-between"
            style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex text-orange-500">
                  <Star fill="currentColor" size={18} className="mr-1" />
                  <Star fill="currentColor" size={18} className="mr-1" />
                  <Star fill="currentColor" size={18} className="mr-1" />
                  <Star fill="currentColor" size={18} className="mr-1" />
                  <Star fill="currentColor" size={18} />
                </div>
                <a href="#" className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-colors">
                  Framer.com <ArrowUpRight size={14} />
                </a>
              </div>
              
              <p className="text-lg text-slate-300 font-medium leading-relaxed mb-10">
                {rev.text}
              </p>
            </div>
            
            <div>
              <span className="font-extrabold text-white">{rev.author}</span>
              <span className="text-slate-500 text-sm font-medium ml-2">- {rev.role}</span>
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  );
};

export default Testimonials;
