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
        <div className="inline-block px-6 py-2 bg-purple-500/20 rounded-full mb-4">
          <span className="text-purple-300 font-semibold">🃟 CONTACT 🃟</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Deal Me In</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ rotateY: -90 }} whileInView={{ rotateY: 0 }} className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Your Name" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600" />
            <input type="email" name="email" placeholder="Your Email" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600" />
            <textarea name="message" placeholder="Your Message" rows="4" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600" />
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500"><Send className="w-5 h-5" />Send Message</button>
          </form>
          {submitted && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-xl text-center">Message sent! 🎉</div>}
        </motion.div>

        <motion.div initial={{ rotateY: 90 }} whileInView={{ rotateY: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Connect With Me</h3>
          <div className="space-y-6">
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-purple-600 text-sm mb-2">Email Me</p>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" /><span className="text-gray-900 flex-1">{socials.email}</span>
                <button onClick={() => { navigator.clipboard.writeText(socials.email); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200">{copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-purple-600" />}</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"><Github className="w-4 h-4" />GitHub</a>}
              {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600"><Linkedin className="w-4 h-4" />LinkedIn</a>}
              {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-400"><Twitter className="w-4 h-4" />Twitter</a>}
            </div>
            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">© {new Date().getFullYear()} {personal.name}</p>
              <p className="text-purple-500 text-sm mt-2">Made with ♥️ • Playing Cards Theme</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;