import React, { useState } from 'react';
import { Mail, Send, Phone, MapPin, Linkedin, Github, Twitter, Check } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden px-4 py-16">
      {/* Holographic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cyan glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        {/* Magenta glow */}
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-magenta-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        {/* Purple accent */}
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-magenta-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-magenta-400 mx-auto rounded-full" />
          <p className="text-lg text-cyan-200/80 mt-6 max-w-2xl mx-auto">
            Let's create something extraordinary together. Reach out and let's talk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Contact Info Cards */}
          {[
            { icon: Mail, label: 'Email', value: 'hello@example.com', color: 'from-cyan-500 to-blue-500' },
            { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', color: 'from-purple-500 to-magenta-500' },
            { icon: MapPin, label: 'Location', value: 'Remote - Worldwide', color: 'from-magenta-500 to-pink-500' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="group relative">
                {/* Holographic border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg`} />
                
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/60 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} p-0.5 mb-4`}>
                    <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r" style={{backgroundImage: `linear-gradient(to right, ${item.color})`}} />
                    </div>
                  </div>
                  <h3 className="text-cyan-300 font-bold text-sm uppercase tracking-wider mb-2">{item.label}</h3>
                  <p className="text-white text-lg font-semibold">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="relative">
          {/* Form border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-magenta-500/30 rounded-3xl blur-xl" />
          
          <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-8 md:p-12">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-black text-white mb-2">Send a Message</h2>
                <p className="text-cyan-200/70 mb-8">Fill out the form and we'll get back to you in 24 hours</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div>
                      <label className="block text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={`w-full bg-slate-800/50 backdrop-blur border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${
                          errors.name 
                            ? 'border-red-500/80 focus:border-red-400 focus:shadow-lg focus:shadow-red-500/30' 
                            : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30'
                        }`}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`w-full bg-slate-800/50 backdrop-blur border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${
                          errors.email 
                            ? 'border-red-500/80 focus:border-red-400 focus:shadow-lg focus:shadow-red-500/30' 
                            : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30'
                        }`}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="block text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className={`w-full bg-slate-800/50 backdrop-blur border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${
                        errors.subject 
                          ? 'border-red-500/80 focus:border-red-400 focus:shadow-lg focus:shadow-red-500/30' 
                          : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30'
                      }`}
                    />
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message here..."
                      rows={6}
                      className={`w-full bg-slate-800/50 backdrop-blur border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 resize-none ${
                        errors.message 
                          ? 'border-red-500/80 focus:border-red-400 focus:shadow-lg focus:shadow-red-500/30' 
                          : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30'
                      }`}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300" />
                    <button
                      type="submit"
                      className="relative w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:scale-105"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-magenta-400 p-0.5 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Check className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Message Sent!</h3>
                <p className="text-cyan-200/70 mb-4">Thank you for reaching out. We'll get back to you soon.</p>
                <div className="inline-block text-sm text-magenta-400 font-semibold">Redirecting in 5 seconds...</div>
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-16 text-center">
          <p className="text-cyan-300 font-semibold uppercase tracking-wider text-sm mb-6">Connect With Us</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { icon: Github, label: 'GitHub' },
              { icon: Linkedin, label: 'LinkedIn' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Mail, label: 'Email' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href="#"
                  className="group relative w-12 h-12 rounded-xl bg-slate-800/50 border border-cyan-500/30 flex items-center justify-center hover:border-cyan-400/60 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300" />
                  <Icon className="w-5 h-5 text-cyan-400 relative z-10" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
