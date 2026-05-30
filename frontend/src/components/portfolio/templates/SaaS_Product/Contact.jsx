import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

function teaser(bio = '') {
  if (bio.length <= 100) {
    return bio;
  }

  return `${bio.slice(0, 100).trim()}...`;
}

function socialsList(socials = {}) {
  return [
    { label: 'Github', value: socials.github, href: socials.github, Icon: Github },
    { label: 'LinkedIn', value: socials.linkedin, href: socials.linkedin, Icon: Linkedin },
    { label: 'Twitter', value: socials.twitter, href: socials.twitter, Icon: Twitter },
    { label: 'Email', value: socials.email, href: socials.email ? `mailto:${socials.email}` : '', Icon: Mail },
  ].filter((item) => item.value);
}

export default function Contact({ data }) {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#0D0D12] px-5 pb-8 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-7xl"
      >
        <div className="grid gap-12 border-t border-white/5 pt-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-[#F1F0FF]">{data.personal?.name}</h2>
            <p className="mt-2 text-[#8884A8]">{data.personal?.title}</p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#4B4870]">{teaser(data.personal?.bio)}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-3 py-1.5 text-xs font-medium text-[#D1FAE5]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
              </span>
              Available for work
            </div>
          </div>

          <div className="space-y-3">
            {socialsList(data.socials || {}).map(({ label, value, href, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between gap-5 rounded-xl border border-white/8 bg-[#13131A] px-5 py-4 text-[#8884A8] transition hover:border-[#6366F1]/40 hover:text-white"
              >
                <span className="flex items-center gap-4">
                  <Icon size={28} className="text-[#6366F1]" strokeWidth={1.7} />
                  <span className="font-medium">{label}</span>
                </span>
                <span className="break-all text-right text-sm text-[#4B4870]">{value}</span>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/5 pt-6 text-xs text-[#4B4870] md:flex-row">
          <p>&copy; {year} {data.personal?.name}. All rights reserved.</p>
          <p>Built with React & Tailwind</p>
        </div>
      </motion.div>
    </footer>
  );
}

