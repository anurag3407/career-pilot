import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle, RotateCcw, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Send to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Message sent successfully!');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center px-4 py-16 font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-zinc-400">Have a question or want to collaborate? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <motion.div
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Mail className="text-blue-400" size={24} />
              <h3 className="text-lg font-semibold text-white">Email</h3>
            </div>
            <p className="text-zinc-400 text-sm">support@careerpilot.com</p>
            <p className="text-zinc-500 text-xs mt-2">We'll respond within 24 hours</p>
          </motion.div>

          <motion.div
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <MapPin className="text-purple-400" size={24} />
              <h3 className="text-lg font-semibold text-white">Location</h3>
            </div>
            <p className="text-zinc-400 text-sm">Remote-First</p>
            <p className="text-zinc-500 text-xs mt-2">Available worldwide</p>
          </motion.div>

          <motion.div
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Phone className="text-green-400" size={24} />
              <h3 className="text-lg font-semibold text-white">Response Time</h3>
            </div>
            <p className="text-zinc-400 text-sm">Quick & Helpful</p>
            <p className="text-zinc-500 text-xs mt-2">Priority support</p>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12 backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
              <p className="text-zinc-400 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange('name')}
                      placeholder="John Doe"
                      className={`w-full bg-zinc-800 border rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-zinc-700'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      placeholder="you@example.com"
                      className={`w-full bg-zinc-800 border rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-zinc-700'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange('subject')}
                    placeholder="How can we help?"
                    className={`w-full bg-zinc-800 border rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors ${
                      errors.subject ? 'border-red-500' : 'border-zinc-700'
                    }`}
                  />
                  {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={handleChange('message')}
                    placeholder="Tell us more about your inquiry..."
                    className={`w-full bg-zinc-800 border rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none ${
                      errors.message ? 'border-red-500' : 'border-zinc-700'
                    }`}
                  />
                  {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
              <p className="text-zinc-400 mb-6">
                Thank you for reaching out. We'll review your message and get back to you shortly.
              </p>
              <button
                onClick={handleReset}
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={16} />
                Send Another Message
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-zinc-400 mb-6">Or connect with us on social media</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white hover:bg-blue-600 hover:border-blue-500 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white hover:bg-blue-600 hover:border-blue-500 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white hover:bg-blue-600 hover:border-blue-500 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="mailto:support@careerpilot.com" className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white hover:bg-blue-600 hover:border-blue-500 transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
