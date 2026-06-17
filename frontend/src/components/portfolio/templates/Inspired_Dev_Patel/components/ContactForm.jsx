import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const ContactForm = ({ theme }) => {
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={itemVars} className="p-8 sm:p-10 rounded-[32px] shadow-lg w-full" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }} id="contact">
      <div className="mb-10 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Let's <span className="text-[#4770FF]">Work</span> Together
        </h2>
        <p className="text-lg text-slate-300 font-medium leading-relaxed">
          Looking for a .NET developer to bring your project to life? I specialize in building robust applications with ASP.NET Core, C#, and SQL that solve real-world problems and help businesses grow.
        </p>
      </div>

      <form className="p-6 sm:p-10 rounded-3xl" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-white">Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              className="px-5 py-4 rounded-xl bg-black text-white border border-white/5 focus:border-blue-500 focus:outline-none transition-colors w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-white">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-5 py-4 rounded-xl bg-black text-white border border-white/5 focus:border-blue-500 focus:outline-none transition-colors w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-white">What Do You Need?</label>
            <select className="px-5 py-4 rounded-xl bg-black text-white border border-white/5 focus:border-blue-500 focus:outline-none transition-colors w-full appearance-none">
              <option value="">Select a service...</option>
              <option value="web">Web Development</option>
              <option value="api">API Development</option>
              <option value="erp">ERP & CRM</option>
              <option value="ai">AI Integration</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-white">Project Urgency</label>
            <select className="px-5 py-4 rounded-xl bg-black text-white border border-white/5 focus:border-blue-500 focus:outline-none transition-colors w-full appearance-none">
              <option value="">How soon do you need it?</option>
              <option value="immediate">Immediately</option>
              <option value="1month">Within 1 Month</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

        </div>

        <div className="flex flex-col gap-2 mb-8">
          <label className="text-sm font-bold text-white">Comment</label>
          <textarea 
            placeholder="Type details about your inquiry" 
            rows="5"
            className="px-5 py-4 rounded-xl bg-black text-white border border-white/5 focus:border-blue-500 focus:outline-none transition-colors w-full resize-none"
          ></textarea>
        </div>

        <button 
          type="button"
          className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          Send Message
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
