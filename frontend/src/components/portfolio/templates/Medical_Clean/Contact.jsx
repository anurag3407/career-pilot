import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  Globe,
  CheckCircle,
  AlertCircle,
  Heart,
  Clock,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/* ─── ECG / Pulse SVG path ─────────────────────────────── */
function EcgLine() {
  return (
    <svg
      viewBox="0 0 400 60"
      className="w-full h-10 text-teal-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline
        points="0,30 40,30 55,30 65,8 72,52 80,8 88,30 100,30 115,30 125,30 140,30 155,30 165,8 172,52 180,8 188,30 200,30 215,30 225,30 240,30 255,30 265,8 272,52 280,8 288,30 300,30 315,30 325,30 340,30 355,30 365,8 372,52 380,8 388,30 400,30"
        className="ecg-stroke"
      />
      <style>{`
        .ecg-stroke {
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation: ecgDraw 2.8s ease-in-out infinite;
        }
        @keyframes ecgDraw {
          0%   { stroke-dashoffset: 900; opacity: 1; }
          70%  { stroke-dashoffset: 0;   opacity: 1; }
          85%  { stroke-dashoffset: 0;   opacity: 0.6; }
          100% { stroke-dashoffset: -900; opacity: 0; }
        }
      `}</style>
    </svg>
  );
}

/* ─── Pulsing heartbeat dot ─────────────────────────────── */
function PulseDot({ color = 'bg-teal-400' }) {
  return (
    <span className="relative inline-flex h-3 w-3">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-50`}
      />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`} />
    </span>
  );
}

/* ─── Contact info card ─────────────────────────────────── */
function InfoCard({ icon: _Icon, label, value, href }) {
  const content = (
    <div className="group flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all duration-300">
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors duration-300">
        <_Icon className="w-5 h-5 text-teal-600" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700 truncate group-hover:text-teal-700 transition-colors duration-200">
          {value}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}

/* ─── Social pill ────────────────────────────────────────── */
function SocialPill({ href, icon: _Icon, label, color }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${color}`}
    >
      <_Icon className="w-4 h-4" strokeWidth={1.8} />
      <span>{label}</span>
    </a>
  );
}

/* ─── Form field ─────────────────────────────────────────── */
function FormField({ label, id, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function Contact() {
  const { personal, socials } = data;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  /* Intersection observer for entrance animation */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message cannot be empty';
    else if (form.message.trim().length < 20) e.message = 'Please write at least 20 characters';
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('submitting');
    /* Simulated async send — replace with real API call */
    await new Promise(r => setTimeout(r, 1600));
    setStatus('success');
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  const inputBase =
    'w-full px-4 py-3 rounded-xl border text-sm text-slate-700 placeholder-slate-300 bg-white outline-none transition-all duration-200 focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400';
  const inputNormal = `${inputBase} border-slate-200`;
  const inputError = `${inputBase} border-red-300 bg-red-50/40 focus:ring-red-300/40 focus:border-red-400`;

  /* ── Current time badge ── */
  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-gradient-to-b from-slate-50 to-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ── Background grid pattern ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#0f766e 1px, transparent 1px), linear-gradient(90deg, #0f766e 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Decorative blobs ── */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-teal-100 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-100 opacity-30 blur-3xl" />

      <div className="relative max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 mb-6">
            <PulseDot />
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
              Open to Consultations
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
            Get in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
              Touch
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-base leading-relaxed">
            Whether it's a clinical collaboration, speaking engagement, or research inquiry — I
            respond within{' '}
            <strong className="text-teal-700 font-semibold">24 hours</strong>.
          </p>

          {/* ECG divider */}
          <div className="mt-8 max-w-sm mx-auto opacity-70">
            <EcgLine />
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Left panel: info ── */}
          <div
            className={`lg:col-span-2 flex flex-col gap-6 transition-all duration-700 delay-150 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Availability card */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg shadow-teal-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Heart className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs text-teal-100 uppercase tracking-widest font-semibold">
                    Availability
                  </p>
                  <p className="text-white font-bold text-base">Currently Accepting</p>
                </div>
              </div>
              <p className="text-teal-100 text-sm leading-relaxed">
                New patients, research partners, and speaking invitations. Let's connect.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-teal-100">
                <Clock className="w-3.5 h-3.5" />
                <span>Local time: {time}</span>
              </div>
            </div>

            {/* Contact info tiles */}
            <div className="flex flex-col gap-3">
              <InfoCard
                icon={Mail}
                label="Email"
                value={personal.email}
                href={`mailto:${personal.email}`}
              />
              <InfoCard
                icon={Phone}
                label="Phone"
                value={personal.phone}
                href={`tel:${personal.phone}`}
              />
              <InfoCard
                icon={MapPin}
                label="Location"
                value={personal.location}
              />
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Connect Online
              </p>
              <div className="flex flex-wrap gap-2">
                {socials.github && (
                  <SocialPill
                    href={socials.github}
                    icon={Github}
                    label="GitHub"
                    color="border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                  />
                )}
                {socials.linkedin && (
                  <SocialPill
                    href={socials.linkedin}
                    icon={Linkedin}
                    label="LinkedIn"
                    color="border-blue-200 text-blue-600 hover:border-blue-400 hover:text-blue-800"
                  />
                )}
                {socials.twitter && (
                  <SocialPill
                    href={socials.twitter}
                    icon={Twitter}
                    label="Twitter"
                    color="border-sky-200 text-sky-500 hover:border-sky-400 hover:text-sky-700"
                  />
                )}
                {socials.website && (
                  <SocialPill
                    href={socials.website}
                    icon={Globe}
                    label="Website"
                    color="border-teal-200 text-teal-600 hover:border-teal-400 hover:text-teal-800"
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── Right panel: form ── */}
          <div
            className={`lg:col-span-3 transition-all duration-700 delay-300 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">

              {/* Form header with vital-sign accent */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Send a Message</h3>
                  <p className="text-xs text-slate-400 mt-0.5">All fields are required</p>
                </div>
                {/* Mini vital monitor badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <PulseDot color="bg-emerald-400" />
                  <span className="text-xs font-bold text-emerald-700">Secure</span>
                </div>
              </div>

              {/* Success state */}
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center animate-bounce">
                    <CheckCircle className="w-8 h-8 text-teal-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Message Received!</h4>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Thank you for reaching out. I'll review your message and get back to you within
                    24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-teal-700 border border-teal-200 hover:bg-teal-50 transition-colors duration-200"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Full Name" id="mc-name" error={errors.name}>
                      <input
                        id="mc-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Dr. Jane Smith"
                        className={errors.name ? inputError : inputNormal}
                      />
                    </FormField>

                    <FormField label="Email Address" id="mc-email" error={errors.email}>
                      <input
                        id="mc-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@hospital.org"
                        className={errors.email ? inputError : inputNormal}
                      />
                    </FormField>
                  </div>

                  {/* Subject */}
                  <FormField label="Subject" id="mc-subject" error={errors.subject}>
                    <input
                      id="mc-subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="e.g. Research Collaboration Inquiry"
                      className={errors.subject ? inputError : inputNormal}
                    />
                  </FormField>

                  {/* Message */}
                  {/* Message */}
                  <FormField label="Message" id="mc-message" error={errors.message}>
                    <textarea
                      id="mc-message"
                      name="message"
                      rows={5}
                      maxLength={500}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe the purpose of your inquiry in detail…"
                      className={`${errors.message ? inputError : inputNormal} resize-none`}
                    />
                    <p className={`mt-1 text-xs text-right transition-colors duration-200 ${
                      form.message.length >= 500
                        ? 'text-red-500 font-semibold'
                        : form.message.length >= 450
                        ? 'text-amber-500'
                        : 'text-slate-300'
                    }`}>
                      {form.message.length} / 500
                    </p>
                  </FormField>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="group relative w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-md shadow-teal-200 hover:shadow-lg hover:shadow-teal-300 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Bottom trust bar */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
              {[
                '🔒 Encrypted submission',
                '📋 No spam, ever',
                '⚡ Response within 24h',
              ].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
