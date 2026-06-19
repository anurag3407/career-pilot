import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Contact = ({ data }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    timeoutRef.current = setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setFormSubmitted(false);
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Contact</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#212121] rounded-xl p-6 flex items-center gap-4">
          <div className="bg-[#0f0f0f] p-4 rounded-full">
            <Mail size={24} className="text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-white font-semibold">{data.socials.email || 'business@example.com'}</p>
          </div>
        </div>

        <div className="bg-[#212121] rounded-xl p-6 flex items-center gap-4">
          <div className="bg-[#0f0f0f] p-4 rounded-full">
            <Phone size={24} className="text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Phone</p>
            <p className="text-white font-semibold">{data.socials.phone || '+1 (555) 123-4567'}</p>
          </div>
        </div>

        <div className="bg-[#212121] rounded-xl p-6 flex items-center gap-4 lg:col-span-2">
          <div className="bg-[#0f0f0f] p-4 rounded-full">
            <MapPin size={24} className="text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Location</p>
            <p className="text-white font-semibold">{data.personal.location}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-12 bg-[#212121] rounded-xl p-6 md:p-8">
        {formSubmitted ? (
          <div className="text-center py-12" role="status" aria-live="polite">
            <h3 className="text-2xl font-bold text-white">Thank you!</h3>
            <p className="text-gray-400 mt-2">I'll get back to you soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-400 text-sm mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0f0f0f] border border-[#303030] text-gray-100 px-4 py-3 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-400 text-sm mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0f0f0f] border border-[#303030] text-gray-100 px-4 py-3 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="message" className="block text-gray-400 text-sm mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-[#0f0f0f] border border-[#303030] text-gray-100 px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 h-32 resize-none"
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition"
            >
              Send Message
            </button>
          </>
        )}
      </form>
    </motion.div>
  );
};

export default Contact;
