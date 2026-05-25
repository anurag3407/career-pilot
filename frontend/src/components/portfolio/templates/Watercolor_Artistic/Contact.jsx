import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Instagram } from 'lucide-react';

const Contact = ({ 
  name = "Artist Name", 
  email = "hello@artist.com",
  socials = [
    { name: "GitHub", url: "https://github.com/anurag3407", icon: Github },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/anurag3407/", icon: Linkedin },
    { name: "Twitter", url: "https://x.com/anurag3407", icon: Twitter },
    { name: "Instagram", url: "https://www.instagram.com/anurag3407", icon: Instagram },
  ]
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("📧 Contact Form Submitted:", formData);
      // TODO: Connect to real backend here later
      // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
      
      setIsSubmitted(true);
      setIsLoading(false);
    }, 800);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-100 to-rose-100 relative overflow-hidden font-serif">
      {/* Watercolor Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute -left-40 -top-40 w-[600px] h-[600px] opacity-30" viewBox="0 0 200 200">
          <path d="M50 50 Q80 20 120 60 Q160 90 130 140 Q90 170 50 130 Q30 90 50 50" fill="#f687b3" />
        </svg>
        <svg className="absolute -right-32 bottom-20 w-[500px] h-[500px] opacity-30" viewBox="0 0 200 200">
          <path d="M80 40 Q120 10 170 60 Q190 110 140 160 Q90 180 60 130 Q40 80 80 40" fill="#7dd3fc" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-violet-950 mb-4 tracking-tight">Let's Connect</h1>
          <p className="text-xl text-violet-800/80 max-w-md mx-auto">Drop me a message and I'll get back to you with watercolor speed 🎨</p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="backdrop-blur-xl bg-white/70 p-8 rounded-3xl border border-white/50 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-violet-950">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-violet-600 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${email}`} className="text-violet-700 hover:underline">{email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-violet-600 mt-1" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-violet-700">Ludhiana, Punjab, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="backdrop-blur-xl bg-white/70 p-8 rounded-3xl border border-white/50 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-violet-950">Follow My Art</h3>
              <div className="flex flex-wrap gap-4">
                {socials.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 bg-white/80 hover:bg-white px-5 py-3 rounded-2xl transition-all hover:scale-105 border border-white/70"
                    >
                      <Icon className="w-5 h-5 text-violet-600 group-hover:text-fuchsia-600 transition-colors" />
                      <span className="font-medium text-sm">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <div className="backdrop-blur-2xl bg-white/75 p-10 rounded-3xl border border-white/60 shadow-2xl">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 rounded-2xl border border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 rounded-2xl border border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                    />
                  </div>

                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                  />

                  <textarea
                    name="message"
                    placeholder="Your Message..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-3xl border border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none resize-y transition-all"
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-4 px-8 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-[0.985]"
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    🎨
                  </div>
                  <h3 className="text-3xl font-bold text-violet-950 mb-3">Message Received!</h3>
                  <p className="text-violet-700 mb-8">Thank you! I'll reply soon with a splash of color.</p>
                  <button
                    onClick={resetForm}
                    className="px-8 py-3 bg-white border-2 border-violet-300 rounded-2xl font-medium hover:bg-violet-50 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;