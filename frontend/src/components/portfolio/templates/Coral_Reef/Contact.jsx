import React from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Contact() {
  const { personal, socials } = data;

  return (
    <section id="contact" className="py-24 bg-[#004b63] text-white relative">
      <div className="container mx-auto px-6">
        <div className="bg-[#001f2d] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Contact Info Side */}
            <div className="lg:w-2/5 bg-gradient-to-br from-[#004b63] to-[#001f2d] p-12 lg:p-16 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-8">Let's <span className="text-[#a3e635]">Connect</span></h2>
                <p className="text-gray-300 mb-12 text-lg">
                  Ready to start a new project or just want to say hi? I'm always open to new opportunities.
                </p>

                <div className="space-y-8 mb-16">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#ff7f50]">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Email Me</p>
                      <p className="text-lg font-medium">{socials.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#a3e635]">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Location</p>
                      <p className="text-lg font-medium">{personal.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {[
                    { icon: Github, url: socials.github },
                    { icon: Linkedin, url: socials.linkedin },
                    { icon: Twitter, url: socials.twitter },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-[#ff7f50] hover:text-white transition-all duration-300"
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff7f50]/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            </div>

            {/* Form Side */}
            <div className="lg:w-3/5 p-12 lg:p-16">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#a3e635] transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#a3e635] transition-colors"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Subject</label>
                  <input
                    type="text"
                    placeholder="Project Inquiry"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#a3e635] transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Message</label>
                  <textarea
                    rows="6"
                    placeholder="Hello! I'd like to talk about..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#a3e635] transition-colors resize-none"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-[#a3e635] text-[#001f2d] font-bold rounded-2xl shadow-xl shadow-[#a3e635]/10 flex items-center justify-center gap-3 hover:bg-[#bef264] transition-all"
                >
                  <Send size={20} />
                  Send Message
                </motion.button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-20 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} {personal.name}. Built with Coral Reef Theme.</p>
        </div>
      </div>
    </section>
  );
}
