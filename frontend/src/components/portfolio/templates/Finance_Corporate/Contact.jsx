import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Linkedin, Twitter, Github, Send, Briefcase, ArrowRight } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
   Premium Finance Corporate Background
────────────────────────────────────────────────────────────── */
const BackgroundGlow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#0a0f18]">
    {/* Subtle Glows */}
    <div 
      className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-[0.05] blur-[120px]"
      style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }}
    />
    <div 
      className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-[0.03] blur-[150px]"
      style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }}
    />
    
    {/* Finance Motif: Abstract Candlesticks and Growth Trendline */}
    <div className="absolute inset-0 opacity-[0.07]">
      <svg width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="100%" x2="0" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Subtle Horizontal Grid Lines (Market Levels) */}
        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#ffffff" strokeWidth="1" strokeDasharray="5 10" opacity="0.3" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="1" strokeDasharray="5 10" opacity="0.3" />
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#ffffff" strokeWidth="1" strokeDasharray="5 10" opacity="0.3" />

        {/* Abstract Candlesticks */}
        <g stroke="#ffffff" strokeWidth="2" opacity="0.5">
          {/* Candle 1 */}
          <line x1="15%" y1="60%" x2="15%" y2="30%" />
          <rect x="14%" y="35%" width="2%" height="15%" fill="#34d399" stroke="none" />
          
          {/* Candle 2 */}
          <line x1="35%" y1="50%" x2="35%" y2="20%" />
          <rect x="34%" y="25%" width="2%" height="10%" fill="#ef4444" stroke="none" />
          
          {/* Candle 3 */}
          <line x1="55%" y1="40%" x2="55%" y2="10%" />
          <rect x="54%" y="15%" width="2%" height="20%" fill="#34d399" stroke="none" />
          
          {/* Candle 4 */}
          <line x1="75%" y1="70%" x2="75%" y2="40%" />
          <rect x="74%" y="45%" width="2%" height="18%" fill="#34d399" stroke="none" />
        </g>

        {/* Sweeping Trendline */}
        <path 
          d="M 0 80% Q 20% 60%, 40% 50% T 80% 20% L 100% 10%" 
          fill="none" 
          stroke="url(#trendGradient)" 
          strokeWidth="4" 
        />
        {/* Glow underneath trendline */}
        <path 
          d="M 0 100% L 0 80% Q 20% 60%, 40% 50% T 80% 20% L 100% 10% L 100% 100% Z" 
          fill="url(#trendGradient)" 
          opacity="0.1" 
        />
      </svg>
    </div>
  </div>
);

export default function Contact({ personal, socials }) {
  const [hoveredInput, setHoveredInput] = useState(null);

  if (!personal && (!socials || socials.length === 0)) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const socialIcons = {
    linkedin: <Linkedin className="w-4 h-4" />,
    github: <Github className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />
  };

  const contactItems = [];
  if (personal?.email) {
    contactItems.push({ icon: Mail, label: 'Email', value: personal.email, href: `mailto:${personal.email}` });
  }
  if (personal?.phone) {
    contactItems.push({ icon: Phone, label: 'Phone', value: personal.phone, href: `tel:${personal.phone.replace(/[^0-9+]/g, '')}` });
  }
  if (personal?.location) {
    contactItems.push({ icon: MapPin, label: 'Headquarters', value: personal.location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personal.location)}` });
  }

  return (
    <section 
      id="contact" 
      className="relative min-h-screen flex items-center justify-center py-24 px-6 lg:px-8 font-sans"
    >
      <BackgroundGlow />

      <motion.div 
        className="relative z-10 max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-neutral-600"></div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400">
              <Briefcase className="w-3.5 h-3.5" />
              Corporate Relations
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6">
            Get in <span className="font-semibold text-white">Touch.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl leading-relaxed">
            For investment inquiries, wealth management, or corporate advisory services, please reach out to our dedicated client relations team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Panel */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col h-full"
          >
            <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-800 via-neutral-500 to-neutral-800 opacity-50"></div>
              
              <div>
                <h3 className="text-xl font-medium text-white mb-10 tracking-wide">Direct Contact</h3>
                
                <div className="space-y-8">
                  {contactItems.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      className="flex items-center gap-6 group/item cursor-pointer"
                      target={item.label === 'Headquarters' ? "_blank" : "_self"}
                      rel={item.label === 'Headquarters' ? "noopener noreferrer" : undefined}
                    >
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 group-hover/item:text-white group-hover/item:border-neutral-600 transition-all duration-300">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-1">{item.label}</p>
                        <p className="text-sm text-neutral-300 group-hover/item:text-white transition-colors">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {socials && socials.length > 0 && (
                <div className="mt-16 pt-8 border-t border-neutral-800 flex items-center gap-4">
                  {socials.map((social, idx) => {
                    const platformName = social.platform || '';
                    return (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platformName}
                        title={platformName}
                        className="p-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        {socialIcons[platformName.toLowerCase()] || <ArrowRight className="w-4 h-4" />}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Form Panel */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7"
          >
            <div className="bg-neutral-900/50 border border-neutral-800/80 p-10 lg:p-12 rounded-xl backdrop-blur-sm">
              <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Input */}
                  <div className="relative">
                    <label htmlFor="finance-name" className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-3">Full Name</label>
                    <div
                      className={`border-b transition-colors duration-300 ${hoveredInput === 'name' ? 'border-white' : 'border-neutral-700'}`}
                    >
                      <input 
                        id="finance-name"
                        type="text" 
                        onFocus={() => setHoveredInput('name')}
                        onBlur={() => setHoveredInput(null)}
                        className="w-full pb-3 bg-transparent text-white placeholder-neutral-600 outline-none text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Company Input */}
                  <div className="relative">
                    <label htmlFor="finance-company" className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-3">Organization</label>
                    <div
                      className={`border-b transition-colors duration-300 ${hoveredInput === 'company' ? 'border-white' : 'border-neutral-700'}`}
                    >
                      <input 
                        id="finance-company"
                        type="text" 
                        onFocus={() => setHoveredInput('company')}
                        onBlur={() => setHoveredInput(null)}
                        className="w-full pb-3 bg-transparent text-white placeholder-neutral-600 outline-none text-sm"
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <label htmlFor="finance-email" className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-3">Work Email</label>
                  <div
                    className={`border-b transition-colors duration-300 ${hoveredInput === 'email' ? 'border-white' : 'border-neutral-700'}`}
                  >
                    <input 
                      id="finance-email"
                      type="email" 
                      onFocus={() => setHoveredInput('email')}
                      onBlur={() => setHoveredInput(null)}
                      className="w-full pb-3 bg-transparent text-white placeholder-neutral-600 outline-none text-sm"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="relative">
                  <label htmlFor="finance-message" className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-3">Inquiry Details</label>
                  <div
                    className={`border-b transition-colors duration-300 ${hoveredInput === 'message' ? 'border-white' : 'border-neutral-700'}`}
                  >
                    <textarea 
                      id="finance-message"
                      onFocus={() => setHoveredInput('message')}
                      onBlur={() => setHoveredInput(null)}
                      rows="3"
                      className="w-full pb-3 bg-transparent text-white placeholder-neutral-600 outline-none resize-none text-sm"
                      placeholder="How can we assist you?"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative flex items-center justify-between w-full md:w-auto px-8 py-4 bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors rounded-sm"
                >
                  <span className="tracking-wide">Submit Inquiry</span>
                  <Send className="w-4 h-4 ml-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
