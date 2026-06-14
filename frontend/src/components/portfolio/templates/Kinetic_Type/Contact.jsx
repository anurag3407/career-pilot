import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, ArrowRight } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const socialLinks = [
    { icon: Github, url: data.socials.github, label: 'GitHub' },
    { icon: Linkedin, url: data.socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: data.socials.twitter, label: 'Twitter' },
    { icon: Mail, url: `mailto:${data.socials.email}`, label: 'Email' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-4xl w-full"
      >
        {/* Section title */}
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Let's Connect
            </span>
            <span className="text-gray-600 ml-4">/</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact form */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-100 mb-8">Send me a message</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field */}
              <motion.div whileHover={{ scale: 1.02 }} className="group">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all group-hover:border-cyan-400/30"
                />
              </motion.div>

              {/* Email field */}
              <motion.div whileHover={{ scale: 1.02 }} className="group">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all group-hover:border-cyan-400/30"
                />
              </motion.div>

              {/* Message field */}
              <motion.div whileHover={{ scale: 1.02 }} className="group">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none group-hover:border-cyan-400/30"
                ></textarea>
              </motion.div>

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all flex items-center justify-center gap-2 group"
              >
                {submitted ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-500 font-semibold"
                  >
                    ✓ Message sent!
                  </motion.span>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={18} className="group-hover:block hidden" />
                    </motion.span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Social links and info */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-100 mb-8">Or reach out directly</h3>

              {/* Email link */}
              <motion.a
                href={`mailto:${data.socials.email}`}
                whileHover={{ x: 5 }}
                className="block mb-6 p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 rounded-lg transition-all group"
              >
                <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Email</p>
                <p className="text-xl font-semibold text-cyan-400 group-hover:text-purple-400 transition-colors">
                  {data.socials.email}
                </p>
              </motion.a>

              {/* Location */}
              <motion.div
                whileHover={{ x: 5 }}
                className="p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 rounded-lg transition-all"
              >
                <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">📍 Location</p>
                <p className="text-xl font-semibold text-gray-100">{data.personal.location}</p>
              </motion.div>
            </div>

            {/* Social links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-4">Follow me</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700/50 hover:border-cyan-400/50 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-all"
                      title={social.label}
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer separator */}
        <motion.div variants={itemVariants} className="mt-20 pt-12 border-t border-gray-700/30 text-center">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-gray-400 text-sm"
          >
            Built with passion and creativity ✨
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
