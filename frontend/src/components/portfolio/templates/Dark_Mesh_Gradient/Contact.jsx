import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Contact() {
  const { personal, socials } = data;

  const socialLinks = [
    { icon: Github, url: socials.github, label: 'GitHub' },
    { icon: Linkedin, url: socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: socials.twitter, label: 'Twitter' },
    { icon: Mail, url: `mailto:${socials.email}`, label: 'Email' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Get In{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Touch
          </span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side */}
        <motion.div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Let&apos;s build something remarkable together.
            </h3>

            <p className="text-gray-400 max-w-md">
              Whether you have a project in mind or just want to say hello.
            </p>

            <div className="space-y-4 pt-6">
              <a
                href={`mailto:${socials.email}`}
                className="flex items-center gap-4 p-5 rounded-2xl bg-gray-900/30 border border-white/5"
              >
                <Mail className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="text-xs text-gray-500 uppercase block">
                    Email Me
                  </span>
                  <span className="text-sm text-gray-200 block mt-0.5">
                    {socials.email}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-gray-900/30 border border-white/5">
                <div className="text-pink-400">
                  📍
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase block">
                    Location
                  </span>
                  <span className="text-sm text-gray-200 block mt-0.5">
                    {personal.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="flex gap-3 pt-8">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className="p-3 rounded-xl bg-gray-900/40 border border-white/10"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Right Side Form */}
        <motion.div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-gray-900/25 border border-white/5 space-y-6"
          >
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="contact-full-name" className="text-xs text-gray-400 uppercase">
                Full Name
              </label>
              <input
                id="contact-full-name"
                name="fullName"
                type="text"
                placeholder="John Doe"
                className="w-full px-5 py-4 rounded-xl bg-gray-950/60 border border-white/10 text-white"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-xs text-gray-400 uppercase">
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="w-full px-5 py-4 rounded-xl bg-gray-950/60 border border-white/10 text-white"
                required
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label htmlFor="contact-subject" className="text-xs text-gray-400 uppercase">
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="How can I help you?"
                className="w-full px-5 py-4 rounded-xl bg-gray-950/60 border border-white/10 text-white"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="contact-message" className="text-xs text-gray-400 uppercase">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Tell me more about your project..."
                className="w-full px-5 py-4 rounded-xl bg-gray-950/60 border border-white/10 text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} {personal.name}. All rights reserved.</p>
      </div>
    </section>
  );
}
