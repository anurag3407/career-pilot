import { Mail, Phone, MapPin, Send, Instagram, Twitter, Linkedin } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    setSent(true);
    timerRef.current = setTimeout(() => setSent(false), 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <section className="bg-white min-h-screen font-serif">
      {/* Editorial Header */}
      <div className="border-b-4 border-black px-6 md:px-16 py-4 flex items-center justify-between">
        <span className="text-xs tracking-[0.3em] uppercase font-sans font-bold text-gray-500">Vol. XII — Issue 04</span>
        <span className="text-xs tracking-[0.3em] uppercase font-sans font-bold text-gray-500">Correspondence</span>
      </div>

      {/* Big Editorial Title */}
      <div className="px-6 md:px-16 pt-12 pb-6 border-b border-gray-200">
        <p className="text-xs tracking-[0.4em] uppercase font-sans text-gray-400 mb-3">Get In Touch</p>
        <h1 className="text-6xl md:text-9xl font-black uppercase leading-none tracking-tighter text-black">
          CONTACT
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <div className="h-px bg-black flex-1" />
          <p className="text-sm font-sans italic text-gray-500">
            "Every great story begins with a single letter."
          </p>
          <div className="h-px bg-black flex-1" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 md:px-16 py-12 grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">

        {/* Left Column — Info */}
        <div className="md:col-span-1 md:border-r border-gray-200 md:pr-10 pb-10 md:pb-0">
          <p className="text-xs tracking-[0.3em] uppercase font-sans font-bold text-gray-400 mb-6 border-b border-gray-200 pb-3">
            Editorial Office
          </p>

          <div className="space-y-6">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 border border-black flex items-center justify-center flex-shrink-0">
                <Mail size={14} />
              </div>
              <div>
                <p className="text-xs font-sans uppercase tracking-widest text-gray-400 mb-1">Email</p>
                <p className="font-serif text-sm text-black">hello@editorial.com</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 border border-black flex items-center justify-center flex-shrink-0">
                <Phone size={14} />
              </div>
              <div>
                <p className="text-xs font-sans uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                <p className="font-serif text-sm text-black">+1 (212) 555-0199</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 border border-black flex items-center justify-center flex-shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-xs font-sans uppercase tracking-widest text-gray-400 mb-1">Studio</p>
                <p className="font-serif text-sm text-black">Manhattan, New York<br />NY 10001</p>
              </div>
            </div>
          </div>

          {/* Pull Quote */}
          <div className="mt-10 border-l-4 border-black pl-4">
            <p className="font-serif italic text-lg leading-snug text-black">
              "Open to collaborations, commissions & creative conversations."
            </p>
          </div>

          {/* Socials */}
          <div className="mt-10">
            <p className="text-xs tracking-[0.3em] uppercase font-sans font-bold text-gray-400 mb-4">Follow</p>
            <div className="flex gap-3">
              
              <a href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                className="w-9 h-9 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
              >
                <Instagram size={14} />
              </a>
              
              <a href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Twitter"
                className="w-9 h-9 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
              >
                <Twitter size={14} />
              </a>
              
              <a href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on LinkedIn"
                className="w-9 h-9 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
              >
                <Linkedin size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column — Form */}
        <div className="md:col-span-2 md:pl-10 pt-10 md:pt-0">
          <p className="text-xs tracking-[0.3em] uppercase font-sans font-bold text-gray-400 mb-6 border-b border-gray-200 pb-3">
            Send a Letter
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs tracking-[0.2em] uppercase font-sans text-gray-500 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-serif text-sm placeholder-gray-300 bg-transparent transition-colors duration-200"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs tracking-[0.2em] uppercase font-sans text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-serif text-sm placeholder-gray-300 bg-transparent transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs tracking-[0.2em] uppercase font-sans text-gray-500 mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-serif text-sm placeholder-gray-300 bg-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs tracking-[0.2em] uppercase font-sans text-gray-500 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Write your message here..."
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 font-serif text-sm placeholder-gray-300 bg-transparent resize-none transition-colors duration-200"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs font-sans text-gray-400 italic">
                {sent ? "✓ Message received. We'll be in touch." : "All inquiries answered within 48hrs."}
              </p>
              <button
                type="submit"
                className="flex items-center gap-2 bg-black text-white px-8 py-3 text-xs tracking-[0.3em] uppercase font-sans font-bold hover:bg-gray-800 transition-colors duration-200"
              >
                <Send size={12} />
                {sent ? "Sent!" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="px-6 md:px-16 py-4 flex items-center justify-between">
        <span className="text-xs font-sans tracking-widest uppercase text-gray-400">© {currentYear} Editorial</span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-2 h-2 ${i % 2 === 0 ? "bg-black" : "bg-gray-300"}`} />
          ))}
        </div>
        <span className="text-xs font-sans tracking-widest uppercase text-gray-400">Print — Digital — Archive</span>
      </div>
    </section>
  );
}