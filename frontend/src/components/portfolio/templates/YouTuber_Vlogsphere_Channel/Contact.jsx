import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Contact = ({ data }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const timeoutRef = useRef(null);

  const safeEmail = typeof data.socials?.email === 'string' ? data.socials.email : 'business@example.com';
  const safeLocation = typeof data.personal?.location === 'string' ? data.personal.location : 'San Francisco, CA';
  const safePhone = typeof data.socials?.phone === 'string' ? data.socials.phone : '+1 (555) 123-4567';

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    timeoutRef.current = setTimeout(() => {
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
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Get In Touch</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-[#212121] rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail size={24} className="text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white font-semibold">{safeEmail}</p>
            </div>
          </div>

          <div className="bg-[#212121] rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone size={24} className="text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Phone</p>
              <p className="text-white font-semibold">{safePhone}</p>
            </div>
          </div>

          <div className="bg-[#212121] rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin size={24} className="text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Location</p>
              <p className="text-white font-semibold">{safeLocation}</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#212121] rounded-xl p-6 md:p-8">
          {formSubmitted ? (
            <div className="bg-green-600/20 border border-green-600 text-green-400 p-6 rounded-xl text-center">
              ✓ Message sent! Thank you for reaching out.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-gray-400 text-sm mb-2">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="w-full bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-gray-400 text-sm mb-2">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-gray-400 text-sm mb-2">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  className="w-full bg-[#0f0f0f] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
