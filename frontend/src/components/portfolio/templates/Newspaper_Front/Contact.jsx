import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Contact() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const timeoutRef = useRef(null);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    timeoutRef.current = setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setFormSubmitted(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      initial="initial" 
      animate="animate" 
      variants={fadeInUp} 
      className="bg-stone-800 border-2 border-yellow-600 p-4 md:p-6"
    >
      <h4 className="text-lg font-black text-yellow-600 mb-4 tracking-widest uppercase border-b-2 border-yellow-600 pb-2" style={{ fontFamily: 'Georgia, serif' }}>
        GET IN TOUCH
      </h4>
      {formSubmitted ? (
        <div className="bg-green-600/20 border border-green-600 text-green-400 p-4 rounded text-sm font-semibold text-center" role="status" aria-live="polite">
          ✓ Message sent! Thank you.
        </div>
      ) : (
        <form onSubmit={handleContactSubmit} className="space-y-3">
          <label htmlFor="contact-name" className="block text-sm font-semibold text-yellow-500 mb-1">Your Name</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="Your Name"
            value={contactForm.name}
            onChange={handleContactChange}
            required
            className="w-full bg-stone-900 border border-yellow-600/30 text-gray-100 placeholder-gray-600 px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
          />
          <label htmlFor="contact-email" className="block text-sm font-semibold text-yellow-500 mb-1">Your Email</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="Your Email"
            value={contactForm.email}
            onChange={handleContactChange}
            required
            className="w-full bg-stone-900 border border-yellow-600/30 text-gray-100 placeholder-gray-600 px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
          />
          
          <label htmlFor="contact-message" className="block text-sm font-semibold text-yellow-500 mb-1">Your Message</label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Your Message"
            value={contactForm.message}
            onChange={handleContactChange}
            required
            rows="3"
            className="w-full bg-stone-900 border border-yellow-600/30 text-gray-100 placeholder-gray-600 px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 resize-none"
          />
          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-black py-2 transition flex items-center justify-center gap-2"
          >
            <Send size={16} /> SEND
          </button>
        </form>
      )}
    </motion.div>
  );
}
