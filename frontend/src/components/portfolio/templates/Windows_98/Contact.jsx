import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
 
/**
 * Contact Component - Windows 98 Theme
 * 
 * A retro-styled contact form and information section featuring authentic Windows 98 design.
 * Includes contact form with validation, contact information display, and social links.
 * 
 * @component
 * @example
 * <Contact 
 *   email="john@example.com"
 *   phone="+1 (555) 123-4567"
 *   address="San Francisco, CA"
 *   onSubmit={(formData) => console.log(formData)}
 * />
 */
export default function Contact({
  email = 'contact@example.com',
  phone = '+1 (555) 123-4567',
  address = 'San Francisco, CA',
  onSubmit = null,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
 
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
 
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
 
    return newErrors;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
 
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formData);
      }
      
      setSubmitted(true);
      setSubmitting(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }, 1200);
  };
 
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-teal-600 via-teal-500 to-blue-400 p-4 sm:p-6 flex items-center justify-center font-sans">
      {/* Outer Window Frame */}
      <div className="w-full max-w-4xl shadow-xl" style={{ 
        backgroundColor: '#c0c0c0',
        border: '2px solid',
        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
      }}>
        
        {/* Window Title Bar */}
        <div className="flex items-center justify-between" style={{
          backgroundColor: '#000080',
          color: '#ffffff',
          padding: '2px 2px',
          gap: '2px'
        }}>
          <div className="flex items-center gap-2 flex-1 px-1">
            <div className="w-4 h-4 bg-white" style={{
              background: 'linear-gradient(135deg, #c0c0c0 0%, #dfdfdf 50%, #ffffff 100%)'
            }} />
            <span className="text-xs font-bold tracking-wide">Contact.exe</span>
          </div>
          
          {/* Window Control Buttons */}
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
              style={{ border: '1px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf' }}>
              _
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
              style={{ border: '1px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf' }}>
              □
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white hover:bg-red-600 transition-colors"
              style={{ border: '1px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf' }}>
              ×
            </button>
          </div>
        </div>
 
        {/* Content Area */}
        <div className="p-3 bg-gray-200" style={{ backgroundColor: '#c0c0c0' }}>
          
          {/* Header Section */}
          <div className="mb-4 pb-4 border-b-2" style={{
            borderColor: '#808080 #dfdfdf #dfdfdf #808080',
          }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#000080', letterSpacing: '0.5px' }}>
              Get in Touch
            </h2>
            <p className="text-xs" style={{ color: '#000080', lineHeight: '1.6' }}>
              Have a question or want to work together? Send me a message and I'll get back to you as soon as possible.
            </p>
          </div>
 
          {/* Main Grid: Form + Contact Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
            
            {/* Contact Form - Takes 2 columns on desktop */}
            <div className="lg:col-span-2">
              {submitted ? (
                // Success Message
                <div 
                  className="p-4 mb-4 flex items-start gap-3"
                  style={{
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  }}
                >
                  <CheckCircle size={20} style={{ color: '#008000', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 className="text-xs font-bold mb-1" style={{ color: '#008000' }}>
                      MESSAGE SENT SUCCESSFULLY
                    </h3>
                    <p className="text-xs" style={{ color: '#000080' }}>
                      Thank you! I've received your message and will get back to you shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  {/* Name Field */}
                  <div>
                    <label className="text-xs font-bold" style={{ color: '#000080' }}>
                      NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full text-xs p-2 mt-1"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '2px solid',
                        borderColor: errors.name ? '#ff0000' : '#dfdfdf #808080 #808080 #dfdfdf',
                        color: '#000000',
                      }}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-xs mt-1" style={{ color: '#ff0000' }}>
                        {errors.name}
                      </p>
                    )}
                  </div>
 
                  {/* Email Field */}
                  <div>
                    <label className="text-xs font-bold" style={{ color: '#000080' }}>
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full text-xs p-2 mt-1"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '2px solid',
                        borderColor: errors.email ? '#ff0000' : '#dfdfdf #808080 #808080 #dfdfdf',
                        color: '#000000',
                      }}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs mt-1" style={{ color: '#ff0000' }}>
                        {errors.email}
                      </p>
                    )}
                  </div>
 
                  {/* Subject Field */}
                  <div>
                    <label className="text-xs font-bold" style={{ color: '#000080' }}>
                      SUBJECT *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full text-xs p-2 mt-1"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '2px solid',
                        borderColor: errors.subject ? '#ff0000' : '#dfdfdf #808080 #808080 #dfdfdf',
                        color: '#000000',
                      }}
                      placeholder="Project Inquiry"
                    />
                    {errors.subject && (
                      <p className="text-xs mt-1" style={{ color: '#ff0000' }}>
                        {errors.subject}
                      </p>
                    )}
                  </div>
 
                  {/* Message Field */}
                  <div>
                    <label className="text-xs font-bold" style={{ color: '#000080' }}>
                      MESSAGE *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full text-xs p-2 mt-1"
                      rows="6"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '2px solid',
                        borderColor: errors.message ? '#ff0000' : '#dfdfdf #808080 #808080 #dfdfdf',
                        color: '#000000',
                        fontFamily: 'monospace',
                        resize: 'none',
                      }}
                      placeholder="Write your message here..."
                    />
                    {errors.message && (
                      <p className="text-xs mt-1" style={{ color: '#ff0000' }}>
                        {errors.message}
                      </p>
                    )}
                  </div>
 
                  {/* Submit Button */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="text-xs font-bold px-4 py-2 transition-all"
                      style={{
                        backgroundColor: '#c0c0c0',
                        color: '#000000',
                        border: '2px solid',
                        borderColor: submitting ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                        cursor: submitting ? 'wait' : 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                      onMouseDown={(e) => !submitting && (e.currentTarget.style.borderColor = '#808080 #dfdfdf #dfdfdf #808080')}
                      onMouseUp={(e) => !submitting && (e.currentTarget.style.borderColor = '#dfdfdf #808080 #808080 #dfdfdf')}
                    >
                      {submitting ? '⏳ Sending...' : '→ Send Message'}
                    </button>
                    <button
                      type="reset"
                      onClick={() => {
                        setFormData({ name: '', email: '', subject: '', message: '' });
                        setErrors({});
                      }}
                      className="text-xs font-bold px-4 py-2 transition-all"
                      style={{
                        backgroundColor: '#c0c0c0',
                        color: '#000000',
                        border: '2px solid',
                        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.borderColor = '#808080 #dfdfdf #dfdfdf #808080')}
                      onMouseUp={(e) => (e.currentTarget.style.borderColor = '#dfdfdf #808080 #808080 #dfdfdf')}
                    >
                      Clear
                    </button>
                  </div>
                </form>
              )}
            </div>
 
            {/* Contact Information Section */}
            <div className="lg:col-span-1">
              <div 
                className="p-3 h-full"
                style={{
                  backgroundColor: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                }}
              >
                <h3 className="text-xs font-bold mb-3" style={{ color: '#000080', textTransform: 'uppercase' }}>
                  Contact Info
                </h3>
                
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={14} style={{ color: '#000080' }} />
                      <span className="text-xs font-bold" style={{ color: '#000080' }}>Email</span>
                    </div>
                    <a 
                      href={`mailto:${email}`}
                      className="text-xs hover:underline break-all"
                      style={{ color: '#000080', textDecoration: 'none' }}
                    >
                      {email}
                    </a>
                  </div>
 
                  {/* Phone */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Phone size={14} style={{ color: '#000080' }} />
                      <span className="text-xs font-bold" style={{ color: '#000080' }}>Phone</span>
                    </div>
                    <a 
                      href={`tel:${phone.replace(/\D/g, '')}`}
                      className="text-xs hover:underline"
                      style={{ color: '#000080', textDecoration: 'none' }}
                    >
                      {phone}
                    </a>
                  </div>
 
                  {/* Location */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={14} style={{ color: '#000080' }} />
                      <span className="text-xs font-bold" style={{ color: '#000080' }}>Location</span>
                    </div>
                    <p className="text-xs" style={{ color: '#000080' }}>
                      {address}
                    </p>
                  </div>
 
                  {/* Response Time */}
                  <div 
                    className="p-2 mt-4"
                    style={{
                      backgroundColor: '#c0c0c0',
                      border: '1px solid',
                      borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                    }}
                  >
                    <p className="text-xs" style={{ color: '#000080', lineHeight: '1.4' }}>
                      <strong>Response Time:</strong> Usually within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Social Links / Quick Actions */}
          <div 
            className="p-3"
            style={{
              backgroundColor: '#c0c0c0',
              border: '1px solid',
              borderColor: '#808080 #dfdfdf #dfdfdf #808080',
            }}
          >
            <h3 className="text-xs font-bold mb-2" style={{ color: '#000080', textTransform: 'uppercase' }}>
              Let's Connect
            </h3>
            <p className="text-xs mb-3" style={{ color: '#000080' }}>
              Find me on these platforms:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'GitHub', url: '#', icon: '𝐺' },
                { label: 'LinkedIn', url: '#', icon: '𝐋' },
                { label: 'Twitter', url: '#', icon: '𝐓' },
                { label: 'Portfolio', url: '#', icon: '𝐏' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold px-3 py-1 transition-all"
                  style={{
                    backgroundColor: '#c0c0c0',
                    color: '#000000',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#808080 #dfdfdf #dfdfdf #808080';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dfdfdf #808080 #808080 #dfdfdf';
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
 
        {/* Status Bar */}
        <div 
          className="h-5 flex items-center px-1 text-xs"
          style={{
            backgroundColor: '#c0c0c0',
            borderTop: '1px solid',
            borderTopColor: '#dfdfdf',
            color: '#000080',
          }}
        >
          <span>Ready</span>
          <div className="ml-auto text-xs text-right">
            <span>Windows 98 Portfolio Builder</span>
          </div>
        </div>
      </div>
 
      <style>{`
        @font-feature-settings: "kern" 1;
        * {
          font-family: 'MS Sans Serif', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  );
}