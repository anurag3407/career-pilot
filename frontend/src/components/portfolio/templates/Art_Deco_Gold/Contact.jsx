import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Twitter } from 'lucide-react';

export default function Contact({ data }) {
  const { socials, personal } = data;

  return (
    <section id="contact" className="relative px-6 py-20 md:py-24 bg-slate-950/95">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
          <span className="text-[10px] tracking-[0.35em] uppercase text-amber-200/70 font-semibold">
            Contact
          </span>
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-[2rem] border border-amber-200/20 bg-slate-900/75 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_0.45fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-200/70 font-semibold">
                Let&apos;s collaborate
              </p>
              <h2 className="mt-4 text-4xl font-serif font-black text-amber-100 leading-tight">
                Start your next elegant project.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-amber-100/80">
                Reach out via email or connect on socials. I&apos;m ready to craft a polished brand story with a luxury finish.
              </p>
            </div>

            <div className="space-y-5">
              {socials.email && (
                <a
                  href={`mailto:${socials.email}`}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-amber-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-300"
                >
                  <Mail size={16} /> Email {personal.name.split(' ')[0]}
                </a>
              )}
              <div className="rounded-[1.75rem] border border-amber-200/20 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70 font-semibold mb-4">
                  Connect
                </p>
                <div className="flex flex-wrap gap-3">
                  {socials.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-200/10 text-amber-100 transition hover:bg-amber-200/20">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {socials.github && (
                    <a href={socials.github} target="_blank" rel="noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-200/10 text-amber-100 transition hover:bg-amber-200/20">
                      <Github size={18} />
                    </a>
                  )}
                  {socials.twitter && (
                    <a href={socials.twitter} target="_blank" rel="noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-200/10 text-amber-100 transition hover:bg-amber-200/20">
                      <Twitter size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
