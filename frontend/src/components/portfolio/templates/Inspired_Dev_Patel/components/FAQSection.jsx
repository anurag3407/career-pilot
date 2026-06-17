import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQSection = ({ theme }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What services do you offer as a .NET developer?",
      answer: "As a .NET developer, I specialize in building custom web applications, desktop applications, and APIs using the .NET framework. My services include development, maintenance, debugging, optimization, and consulting on .NET-based solutions. I also offer integration with third-party services and cloud solutions like Azure."
    },
    {
      question: "Do you offer custom solutions or work with existing codebases?",
      answer: "I am highly adaptable. I can architect and build custom solutions from scratch, or I can jump into existing codebases to refactor, debug, and implement new features while adhering to your team's established best practices."
    },
    {
      question: "How do you ensure the quality of your code?",
      answer: "I follow industry-standard practices including Test-Driven Development (TDD), comprehensive unit and integration testing, code reviews, and continuous integration/continuous deployment (CI/CD) pipelines to ensure robust and maintainable code."
    },
    {
      question: "What services do you offer?",
      answer: "Beyond .NET development, I offer database design (SQL Server, PostgreSQL), frontend integration (React, Next.js), API design, and cloud deployments on Azure and AWS."
    }
  ];

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={itemVars} className="p-8 sm:p-10 rounded-[32px] shadow-lg w-full" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
      <div className="mb-10 max-w-4xl">
        <h2 className="text-3xl font-extrabold text-white">
          Frequently Asked <span className="underline decoration-slate-600 decoration-2 underline-offset-8">Questions</span>
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className="rounded-2xl transition-all duration-300 overflow-hidden"
              style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`text-lg font-bold pr-4 transition-colors ${isOpen ? 'text-blue-500' : 'text-slate-300'}`}>
                  {faq.question}
                </span>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 shrink-0 transition-colors hover:bg-white/10">
                  {isOpen ? <Minus size={16} className="text-blue-500" /> : <Plus size={16} className="text-blue-500" />}
                </div>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-slate-300 font-medium leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FAQSection;
