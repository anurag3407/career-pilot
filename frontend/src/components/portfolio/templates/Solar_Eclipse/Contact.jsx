import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Send } from 'lucide-react';

export default function Contact({ socials, name }) {
  const socialLinks = [
    { icon: Github, href: socials.github, label: 'GitHub' },
    { icon: Linkedin, href: socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: socials.twitter, label: 'Twitter' },
    { icon: Mail, href: `mailto:${socials.email}`, label: 'Email' },
  ];

  return (
    <footer id="contact" className="relative py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Decorative eclipse mini */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-8 w-16 h-16 rounded-full"
          style={{
            background: 'radial-gradient(circle, #000 30%, #ff6a00 50%, transparent 70%)',
            boxShadow: '0 0 30px 10px #ff6a0030',
          }}
        />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Let&apos;s <span className="text-orange-400">Connect</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-400 mb-10"
        >
          Have a project in mind? Let&apos;s bring it to life.
        </motion.p>

        {/* Email CTA */}
        <motion.a
          href={`mailto:${socials.email}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow mb-10"
        >
          <Send size={16} />
          Send me an email
        </motion.a>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500/40 flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors"
              aria-label={social.label}
            >
              <social.icon size={18} />
            </motion.a>
          ))}
        </motion.div>

        {/* Footer text */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
