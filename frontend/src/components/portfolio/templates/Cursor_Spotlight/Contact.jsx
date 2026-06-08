import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send } from 'lucide-react';

const Contact = ({ personal, socials }) => {
  return (
    <section className="relative z-10 mx-auto max-w-5xl py-24 px-6">
      <div className="mb-12 flex items-center gap-4">
        <Mail className="text-blue-500" />
        <h2 className="text-3xl font-bold text-white">Contact</h2>
      </div>
      
      <div className="grid gap-12 md:grid-cols-2">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <h3 className="mb-4 text-2xl font-bold text-white">Let's build something.</h3>
          <p className="mb-8 text-zinc-400">
            Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
          </p>
          
          <div className="space-y-6">
            <motion.a 
              href={`mailto:${socials.email}`}
              whileHover={{ x: 10, color: '#60a5fa' }}
              className="flex items-center gap-4 text-zinc-300 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50">
                <Mail size={20} />
              </div>
              <span className="font-medium">{socials.email}</span>
            </motion.a>

            {personal.location && (
              <motion.div 
                whileHover={{ x: 10, color: '#60a5fa' }}
                className="flex items-center gap-4 text-zinc-300 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50">
                  <MapPin size={20} />
                </div>
                <span className="font-medium">{personal.location}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 backdrop-blur-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-zinc-400">Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="John Doe"
              className="cursor-none rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors focus:border-blue-500 focus:bg-zinc-950"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="john@example.com"
              className="cursor-none rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors focus:border-blue-500 focus:bg-zinc-950"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
            <textarea 
              id="message" 
              rows="4"
              placeholder="Hello..."
              className="cursor-none resize-none rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors focus:border-blue-500 focus:bg-zinc-950"
            ></textarea>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: '#3b82f6' }}
            whileTap={{ scale: 0.98 }}
            className="cursor-none mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-bold text-white transition-colors"
          >
            Send Message <Send size={18} />
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;