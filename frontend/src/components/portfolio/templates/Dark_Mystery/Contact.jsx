import React, { useEffect, useRef, useState } from 'react';
import {
  Fingerprint,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquareLock,
  Send,
  ShieldAlert,
  Twitter,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const channelLinks = (socials) =>
  [
    { label: 'GitHub', href: socials.github, icon: Github, tone: 'amber' },
    { label: 'LinkedIn', href: socials.linkedin, icon: Linkedin, tone: 'emerald' },
    { label: 'Twitter', href: socials.twitter, icon: Twitter, tone: 'amber' },
  ].filter((item) => Boolean(item.href));

export default function Contact({
  personal = data.personal,
  socials = data.socials,
}) {
  const [formStatus, setFormStatus] = useState('idle');
  const sendTimerRef = useRef(null);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (sendTimerRef.current) window.clearTimeout(sendTimerRef.current);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formStatus !== 'idle') return;

    setFormStatus('sending');
    sendTimerRef.current = window.setTimeout(() => {
      setFormStatus('sent');
      resetTimerRef.current = window.setTimeout(() => setFormStatus('idle'), 1800);
    }, 1100);
  };

  const channels = channelLinks(socials);

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-[#030406] px-4 py-20 text-stone-100 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_82%,rgba(112,24,54,0.34),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(19,83,75,0.22),transparent_32%),linear-gradient(160deg,#030406_0%,#0a090c_52%,#040506_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgba(245,230,190,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,190,0.6)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute bottom-0 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 translate-y-1/3 rounded-full bg-[#7f1d1d]/18 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl lg:mb-16">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-amber-100/70">
            <ShieldAlert className="h-4 w-4" />
            Secure dispatch
          </p>
          <h2 className="font-serif text-4xl leading-tight text-stone-50 sm:text-5xl lg:text-6xl">
            Leave a tip. Open a case.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
            Every great investigation starts with a single lead. Send a confidential message or
            reach out through any verified channel below.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <div className="relative border border-stone-500/20 bg-black/45 p-6 shadow-2xl shadow-black/60 backdrop-blur-md sm:p-8">
            <div className="absolute inset-4 border border-stone-600/15" />
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full border border-dashed border-amber-200/15" />
            <div className="absolute bottom-12 left-8 h-px w-40 rotate-[18deg] bg-emerald-100/15" />

            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-2 border border-red-300/20 bg-red-950/25 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-red-100/80 sm:text-xs">
                <Fingerprint className="h-4 w-4" />
                Verified channels
              </div>

              <div className="space-y-5">
                {socials.email && (
                  <a
                    href={`mailto:${socials.email}`}
                    className="group flex items-start gap-4 border border-stone-500/20 bg-stone-950/50 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-amber-200/30 hover:bg-stone-950/80"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-amber-200/20 bg-amber-950/20 text-amber-100/80 transition duration-300 group-hover:border-amber-200/40 group-hover:text-amber-50">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                        Secure line
                      </p>
                      <p className="mt-1 break-all font-serif text-lg text-stone-100 transition duration-300 group-hover:text-amber-50">
                        {socials.email}
                      </p>
                    </div>
                  </a>
                )}

                {personal.location && (
                  <div className="flex items-start gap-4 border border-stone-500/20 bg-stone-950/50 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-emerald-200/20 bg-emerald-950/20 text-emerald-100/80">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                        Last known coordinates
                      </p>
                      <p className="mt-1 font-serif text-lg text-stone-100">{personal.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {channels.length > 0 && (
                <div className="mt-8">
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                    External dossiers
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {channels.map(({ label, href, icon: Icon, tone }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className={`group inline-flex items-center gap-2 border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition duration-300 hover:-translate-y-0.5 ${
                          tone === 'emerald'
                            ? 'border-emerald-200/15 bg-emerald-950/15 text-emerald-100/75 hover:border-emerald-200/35 hover:bg-emerald-950/30'
                            : 'border-amber-200/15 bg-amber-950/15 text-amber-100/75 hover:border-amber-200/35 hover:bg-amber-950/30'
                        }`}
                      >
                        <Icon className="h-4 w-4 transition duration-300 group-hover:scale-110" />
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 border-t border-stone-700/50 pt-6">
                <p className="text-sm leading-7 text-stone-500">
                  Response time is typically within 24 hours. All inquiries are treated as
                  confidential unless otherwise noted.
                </p>
              </div>
            </div>
          </div>

          <div className="relative border border-stone-500/20 bg-stone-950/55 p-6 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-8">
            <div className="pointer-events-none absolute right-6 top-6 hidden rotate-[-12deg] border-2 border-red-400/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-red-300/70 sm:block">
              Confidential
            </div>

            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-3">
                <MessageSquareLock className="h-5 w-5 text-red-200/80" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                    Case file submission
                  </p>
                  <h3 className="font-serif text-2xl text-stone-50 sm:text-3xl">Submit your lead</h3>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-codename"
                      className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500"
                    >
                      Codename
                    </label>
                    <input
                      id="contact-codename"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full border border-stone-600/30 bg-black/50 px-4 py-3 text-sm text-stone-100 outline-none transition duration-300 placeholder:text-stone-600 focus:border-amber-200/40 focus:bg-black/70 focus:shadow-[0_0_24px_rgba(245,158,11,0.08)]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500"
                    >
                      Return address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="you@email.com"
                      className="w-full border border-stone-600/30 bg-black/50 px-4 py-3 text-sm text-stone-100 outline-none transition duration-300 placeholder:text-stone-600 focus:border-emerald-200/35 focus:bg-black/70 focus:shadow-[0_0_24px_rgba(52,211,153,0.08)]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500"
                  >
                    Case reference
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="Project inquiry, collaboration, etc."
                    className="w-full border border-stone-600/30 bg-black/50 px-4 py-3 text-sm text-stone-100 outline-none transition duration-300 placeholder:text-stone-600 focus:border-amber-200/40 focus:bg-black/70 focus:shadow-[0_0_24px_rgba(245,158,11,0.08)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500"
                  >
                    Detailed report
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Describe the case. What problem needs solving?"
                    className="w-full resize-none border border-stone-600/30 bg-black/50 px-4 py-3 text-sm leading-7 text-stone-100 outline-none transition duration-300 placeholder:text-stone-600 focus:border-emerald-200/35 focus:bg-black/70 focus:shadow-[0_0_24px_rgba(52,211,153,0.08)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus !== 'idle'}
                  className="group relative w-full overflow-hidden border border-red-300/25 bg-red-950/35 px-6 py-4 text-xs font-bold uppercase tracking-[0.28em] text-red-50 transition duration-300 hover:border-amber-200/35 hover:bg-red-950/55 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative z-10 inline-flex items-center justify-center gap-2">
                    <Send className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
                    {formStatus === 'idle'
                      ? 'Transmit lead'
                      : formStatus === 'sending'
                        ? 'Encrypting transmission...'
                        : 'Lead received'}
                  </span>
                  <span className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-r from-amber-900/20 via-red-900/30 to-emerald-900/20 transition duration-500 group-hover:translate-y-0" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
