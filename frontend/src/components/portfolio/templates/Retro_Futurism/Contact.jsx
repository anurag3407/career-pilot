import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import SectionHeading from './SectionHeading';
import data from '../../../../data/dummy_data.json';

const SOCIAL_LINKS = [
  { icon: Github, url: data.socials.github, name: 'GitHub' },
  { icon: Linkedin, url: data.socials.linkedin, name: 'LinkedIn' },
  { icon: Twitter, url: data.socials.twitter, name: 'Twitter' },
];

export default function Contact() {
  return (
    <section id="contact" className="p-8 rounded-xl border border-cyan-400/20 bg-slate-950/80 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.08)]">
      <SectionHeading><Mail size={36} className="text-pink-500" /> Establish Contact</SectionHeading>
      <div className="max-w-3xl mx-auto">
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get('name') || '');
            const email = String(fd.get('email') || '');
            const message = String(fd.get('message') || '');
            const subject = `Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            const params = new URLSearchParams({ subject, body });
            window.location.href = `mailto:${data.socials.email}?${params.toString()}`;
          }}
          className="grid gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="sr-only">Your name</label>
              <input id="name" name="name" placeholder="Your name" required className="px-4 py-3 bg-slate-900/70 border border-slate-800 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="sr-only">Your email</label>
              <input id="email" name="email" type="email" placeholder="Your email" required className="px-4 py-3 bg-slate-900/70 border border-slate-800 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea id="message" name="message" rows={6} placeholder="Message" required className="w-full px-4 py-3 bg-slate-900/70 border border-slate-800 rounded-md text-slate-100 resize-y focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">Or reach via social links below</div>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} title={s.name} className="p-2 bg-slate-900 border border-slate-800 rounded hover:scale-105 transition-transform">
                  <s.icon size={18} className="text-cyan-300" />
                </a>
              ))}
            </div>
          </div>
          <div className="text-right">
            <button type="submit" className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-pink-500 to-cyan-400 text-slate-900 font-bold rounded-md shadow-[0_8px_24px_rgba(99,102,241,0.08)]">Send Message</button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
