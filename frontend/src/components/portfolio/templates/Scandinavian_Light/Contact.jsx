import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

function socialRows(socials = {}) {
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
    <footer id="contact" className="relative bg-[#F7F3EA] px-5 py-20 md:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-[#D9C3A8]" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-7xl"
      >
        <div className="grid gap-10 rounded-[2rem] border border-[#E7DED1] bg-[#FFFDF8] p-6 shadow-[0_24px_80px_rgba(70,56,39,0.08)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C58A63]">Contact</p>
            <h2 className="scandi-serif mt-4 text-4xl font-semibold leading-tight text-[#283028] md:text-5xl">
              Open to thoughtful collaborations.
            </h2>
            <p className="mt-5 max-w-md leading-8 text-[#6F746B]">{data.personal?.title}</p>
          </div>

          <div className="space-y-3">
            {socialRows(data.socials || {}).map(({ label, value, href, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 6 }}
                className="flex flex-col gap-3 rounded-2xl border border-[#E7DED1] bg-[#F7F3EA] p-4 transition hover:border-[#8FA58A] sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex items-center gap-3 font-semibold text-[#283028]">
                  <Icon size={22} className="text-[#315343]" />
                  {label}
                </span>
                <span className="break-all text-sm text-[#6F746B]">{value}</span>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 text-xs text-[#8B7D6B] md:flex-row">
          <p>&copy; {year} {data.personal?.name}. All rights reserved.</p>
          <p>Built with React and Tailwind</p>
        </div>
      </motion.div>
    </footer>
  );
}
