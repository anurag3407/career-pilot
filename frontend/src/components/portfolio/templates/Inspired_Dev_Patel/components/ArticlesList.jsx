import React from 'react';
import { motion } from 'framer-motion';

const ArticlesList = ({ theme }) => {
  const articles = [
    {
      id: 1,
      title: "AI is Not a Replacement — It's a Tool",
      tag: "Development",
      readTime: "15 min read",
      date: "16 june 2026",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
    },
    {
      id: 2,
      title: "My Journey as a .NET Developer: Crafting Solutions, Building Futures",
      tag: "Development",
      readTime: "15 min read",
      date: "16 june 2026",
      image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=500&h=300&fit=crop"
    }
  ];

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={itemVars} className="p-8 sm:p-10 rounded-[32px] shadow-lg w-full" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }} id="blogs">
      <div className="mb-10 max-w-4xl">
        <h2 className="text-3xl font-extrabold mb-4 text-white">
          My Recent Article and Publications
        </h2>
        <p className="text-base text-slate-300 font-medium leading-relaxed">
          As a passionate .NET developer, I enjoy writing about real-world problem solving in software engineering. From ASP.NET Core to database optimization, my publications reflect the lessons I've learned while turning complex challenges into clean, scalable solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <motion.div 
            key={article.id}
            whileHover={{ y: -5 }}
            className="flex flex-col cursor-pointer group"
          >
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mb-6" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 rounded-lg">
                <span className="text-xs font-bold text-blue-600">{article.tag}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-extrabold text-white mb-4 group-hover:text-blue-400 transition-colors">
              {article.title}
            </h3>
            
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
              <span>• {article.readTime}</span>
              <span>• {article.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ArticlesList;
