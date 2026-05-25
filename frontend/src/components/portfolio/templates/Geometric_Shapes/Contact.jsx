import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your submission logic here (e.g., API call)
    console.log('Message sent:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000); // Reset success alert after 5s
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      
      {/* --- GEOMETRIC BACKGROUND ART --- */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Soft, warm ambient circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl"></div>
        
        {/* Floating geometric accent shapes */}
        <div className="absolute top-12 right-1/4 w-12 h-12 border-2 border-slate-700/50 rounded-xl transform rotate-12 animate-bounce [animation-duration:6s]"></div>
        <div className="absolute bottom-16 left-10 w-24 h-24 border border-indigo-500/20 rounded-3xl transform -rotate-45 animate-pulse"></div>
        
        {/* Fine background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="relative z-10 w-full max-w-5xl bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT SIDE: Human Context & Quick Help (5 Columns) */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-gradient-to-b from-slate-800/80 to-slate-900/40 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-700/60">
          <div>
            <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">Say Hello</span>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-2">Let’s talk.</h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed">
              Whether you have a messy question, a feature idea, or just want to tell us we're doing a good job—we’re on the other end reading. 
            </p>
          </div>

          {/* Micro FAQ / Human touchpoints */}
          <div className="mt-12 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">When will I hear back?</h4>
              <p className="text-sm text-slate-400 mt-1">Usually within 24 hours. We don't do automated robot replies; a real human will read this.</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Prefer direct email?</h4>
              <p className="text-sm text-indigo-400 mt-1 hover:underline cursor-pointer">hello@careerpilot.com</p>
            </div>
          </div>

          <div className="mt-12 text-xs text-slate-500">
            Based somewhere on Earth 🌍 • Operating asynchronously.
          </div>
        </div>

        {/* RIGHT SIDE: The Form (7 Columns) */}
        <div className="lg:col-span-7 p-8 lg:p-12 bg-slate-900/20">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold">✓</div>
              <h3 className="text-xl font-semibold text-white">Message sent beautifully!</h3>
              <p className="text-sm text-slate-400 max-w-xs">Thanks for reaching out. We'll grab a coffee, read it over, and get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What should we call you?
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name or nickname"
                  className="mt-2 block w-full px-4 py-3 bg-slate-950/40 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Where can we reply to you?
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@domain.com"
                  className="mt-2 block w-full px-4 py-3 bg-slate-950/40 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What’s on your mind?
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Drop your thoughts, questions, or links here..."
                  className="mt-2 block w-full px-4 py-3 bg-slate-950/40 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/10 transition-all duration-150 transform active:scale-[0.98]"
                >
                  Send it over
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}