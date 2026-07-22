import React from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

export default function Contact({ data }) {
  const email = data?.personalInfo?.email || 'hello@abstract.art';
  const location = data?.personalInfo?.location || 'Digital Realm';

  return (
    <section className="relative w-full py-24 overflow-hidden bg-white">
      {/* Background gradients */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-teal-200 to-emerald-100 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-purple-200 to-pink-100 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600 mb-6">
            Let's Create.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Reach out to collaborate on something beautiful.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/50 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-2">Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-white/80 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-teal-100 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-2">Email</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="w-full bg-white/80 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-2">Message</label>
                <textarea 
                  rows="4"
                  placeholder="Your artistic vision..." 
                  className="w-full bg-white/80 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-pink-100 outline-none transition-all placeholder:text-gray-400 text-gray-800 resize-none"
                ></textarea>
              </div>
              <button type="button" className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-purple-500 text-white font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                <Mail className="w-7 h-7 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Email</p>
                <p className="text-xl text-gray-800 font-medium">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <MapPin className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Location</p>
                <p className="text-xl text-gray-800 font-medium">{location}</p>
              </div>
            </div>

            {/* Socials */}
            <div className="pt-8 mt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-6">Socials</p>
              <div className="flex gap-4">
                {[Github, Linkedin, Twitter].map((Icon, idx) => (
                  <a 
                    key={idx}
                    href="#" 
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-pink-400 hover:text-pink-500 hover:bg-pink-50 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
