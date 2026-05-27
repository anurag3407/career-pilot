// Contact form
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, Copy, CheckCircle } from 'lucide-react';

const Contact = ({ data }) => {
  const { socials, personal } = data;
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    e.target.reset();
  };

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <div className="inline-block px-6 py-2 bg-amber-800/20 rounded-full mb-4">
          <span className="text-amber-900 font-semibold">🃟 CONTACT 🃟</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-4">Deal Me In</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ rotateY: -90 }} whileInView={{ rotateY: 0 }} className="bg-white/95 rounded-2xl shadow-2xl p-8 border-2 border-amber-700/50">
          <h3 className="text-2xl font-bold text-amber-900 mb-6">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Your Name" required className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:border-amber-600" />
            <input type="email" name="email" placeholder="Your Email" required className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:border-amber-600" />
            <textarea name="message" placeholder="Your Message" rows="4" required className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:border-amber-600"></textarea>
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-xl hover:bg-amber-600"><Send className="w-5 h-5" />Send Message</button>
          </form>
          {submitted && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-xl text-center">Message sent! 🎉</div>}
        </motion.div>

        <motion.div initial={{ rotateY: 90 }} whileInView={{ rotateY: 0 }} transition={{ delay: 0.2 }} className="bg-white/95 rounded-2xl shadow-2xl p-8 border-2 border-amber-700/50">
          <h3 className="text-2xl font-bold text-amber-900 mb-6">Connect With Me</h3>
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-amber-700 text-sm mb-2">Email Me</p>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-700" /><span className="text-amber-900 flex-1">{socials.email}</span>
                <button onClick={() => { navigator.clipboard.writeText(socials.email); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 bg-amber-200 rounded-lg">{copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-amber-700" />}</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {socials.github && <a href={socials.github} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg"><Github className="w-4 h-4" />GitHub</a>}
              {socials.linkedin && <a href={socials.linkedin} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg"><Linkedin className="w-4 h-4" />LinkedIn</a>}
              {socials.twitter && <a href={socials.twitter} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg"><Twitter className="w-4 h-4" />Twitter</a>}
            </div>
            <div className="pt-6 border-t border-amber-200 text-center">
              <p className="text-amber-600">© {new Date().getFullYear()} {personal.name}</p>
              <p className="text-amber-500 text-sm mt-2">Made with ♥️ • Playing Cards Theme</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;