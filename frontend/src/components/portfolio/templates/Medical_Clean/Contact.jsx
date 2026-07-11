import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  User,
  MessageSquare,
  Stethoscope,
  AlertCircle,
} from 'lucide-react';

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Decorative EKG pulse line (pure SVG, no images) */
function EkgLine() {
  return (
    <svg
      viewBox="0 0 400 60"
      className="w-full h-10 text-teal-400 opacity-30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="0,30 60,30 80,10 95,50 110,5 125,55 140,30 200,30 220,30 240,30 260,30 400,30" />
    </svg>
  );
}

/** Single info card */
function InfoCard({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-teal-100 hover:shadow-md hover:border-teal-300 transition-all duration-300 group"
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center group-hover:bg-teal-100 transition-colors duration-300">
        <Icon className="w-5 h-5 text-teal-600" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed">{value}</p>
      </div>
    </motion.div>
  );
}

/** Floating availability badge */
function AvailabilityBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      Available for Consultations
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Contact({ data = {} }) {
  const {
    name = 'Dr. Alexandra Reid',
    email = 'dr.reid@medicalclinic.com',
    phone = '+1 (555) 204-8830',
    location = 'Boston Medical Center, MA',
    hours = 'Mon – Fri, 9:00 AM – 5:00 PM',
    specialty = 'Cardiology & Internal Medicine',
  } = data;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'A valid email address is required.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.message.trim() || form.message.length < 20)
      e.message = 'Please provide at least 20 characters.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setStatus('loading');
    // Simulate async send
    await new Promise((r) => setTimeout(r, 1600));
    setStatus('success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputBase =
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400';
  const inputNormal = `${inputBase} border-slate-200`;
  const inputError = `${inputBase} border-red-300 focus:ring-red-300 focus:border-red-300`;

  const contactInfo = [
    { icon: Mail, label: 'Email', value: email },
    { icon: Phone, label: 'Phone', value: phone },
    { icon: MapPin, label: 'Location', value: location },
    { icon: Clock, label: 'Office Hours', value: hours },
  ];

  return (
    <section
      id="contact"
      className="relative w-full bg-gradient-to-br from-slate-50 via-white to-teal-50/40 py-20 px-4 overflow-hidden font-sans"
    >
      {/* ── Background decoration ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Soft teal blob top-right */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl" />
        {/* Soft blue blob bottom-left */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#0d9488 1px, transparent 1px), linear-gradient(90deg, #0d9488 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          {/* Icon badge */}
          <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-200">
              <Stethoscope className="w-7 h-7 text-white" strokeWidth={1.6} />
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={0.05}
            className="text-xs font-bold uppercase tracking-[0.25em] text-teal-500 mb-2"
          >
            Get in Touch
          </motion.p>

          <motion.h2
            variants={fadeUp}
            custom={0.1}
            className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 leading-tight"
          >
            Schedule a{' '}
            <span className="text-teal-600">Consultation</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={0.15}
            className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-4"
          >
            Specializing in{' '}
            <span className="font-medium text-teal-700">{specialty}</span>. Reach out to
            discuss your health concerns or book an appointment.
          </motion.p>

          <motion.div variants={fadeUp} custom={0.2} className="flex justify-center">
            <AvailabilityBadge />
          </motion.div>

          {/* EKG decorative line */}
          <motion.div variants={fadeUp} custom={0.25} className="mt-6 max-w-md mx-auto">
            <EkgLine />
          </motion.div>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <motion.div variants={fadeUp} custom={0}>
              <h3 className="text-base font-semibold text-slate-700 mb-1">
                Contact Information
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                All communications are handled with the utmost confidentiality in
                accordance with HIPAA guidelines.
              </p>
            </motion.div>

            {contactInfo.map(({ icon, label, value }, i) => (
              <InfoCard key={label} icon={icon} label={label} value={value} delay={i * 0.08} />
            ))}

            {/* HIPAA badge */}
            <motion.div
              variants={fadeUp}
              custom={0.4}
              className="mt-2 flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">Rx</span>
              </div>
              <p className="text-xs text-teal-800 leading-relaxed">
                <span className="font-semibold block">HIPAA Compliant</span>
                Your information is secure and protected.
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={0.1}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-7 md:p-9">
              {/* Form header strip */}
              <div className="flex items-center gap-3 mb-7 pb-5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Send a Message</h3>
                  <p className="text-xs text-slate-400">We respond within 1 business day</p>
                </div>
                <div className="ml-auto">
                  <div className="flex gap-1.5">
                    {['bg-red-300', 'bg-yellow-300', 'bg-green-400'].map((c) => (
                      <span key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                    ))}
                  </div>
                </div>
              </div>

              {status === 'success' ? (
                /* Success state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-14 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" strokeWidth={1.8} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Message Sent!</h4>
                  <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                    Thank you for reaching out. Our office will contact you within one
                    business day.
                  </p>
                  <button type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-xs font-semibold text-teal-600 hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Row: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-slate-600 mb-1.5"
                      >
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={handleChange}
                          className={`${errors.name ? inputError : inputNormal} pl-10`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-slate-600 mb-1.5"
                      >
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className={`${errors.email ? inputError : inputNormal} pl-10`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold text-slate-600 mb-1.5"
                    >
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      placeholder="Appointment inquiry / Second opinion / Research collaboration"
                      value={form.subject}
                      onChange={handleChange}
                      className={errors.subject ? inputError : inputNormal}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-slate-600 mb-1.5"
                    >
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder="Please describe your inquiry or health concern briefly. Do not include sensitive personal health data in this form."
                      value={form.message}
                      onChange={handleChange}
                      className={`${errors.message ? inputError : inputNormal} resize-none`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message ? (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-slate-300 ml-auto">
                        {form.message.length} chars
                      </span>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    ⚕️ This form is for non-emergency inquiries only. If you are
                    experiencing a medical emergency, please call{' '}
                    <span className="font-semibold text-red-500">911</span> immediately.
                  </p>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold text-sm rounded-xl py-3.5 transition-colors duration-200 shadow-md shadow-teal-200 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
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
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" strokeWidth={2} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Footer strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200"
        >
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Stethoscope className="w-4 h-4 text-teal-500" strokeWidth={1.8} />
            <span>
              <span className="font-semibold text-slate-600">{name}</span> ·{' '}
              {specialty}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} · All rights reserved
          </p>
        </motion.div>
      </div>
    </section>
  );
}
