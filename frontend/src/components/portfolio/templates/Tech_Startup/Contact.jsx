import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";

const Contact = () => {
  return (
    <section className="relative overflow-hidden bg-black text-white py-20 px-6">

      <h1 className="text-red-500 text-5xl font-bold">
  TECH STARTUP CONTACT
</h1>
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div>
          <p className="text-cyan-400 uppercase tracking-widest mb-4">
            Contact Us
          </p>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Let’s Build The <span className="text-cyan-400">Future</span> Together
          </h2>

          <p className="text-gray-400 text-lg mb-10 max-w-xl">
            Have a startup idea, collaboration opportunity, or innovative project?
            We’d love to hear from you and help turn your vision into reality.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Mail className="text-cyan-400" />
              <span>startup@careerpilot.dev</span>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-cyan-400" />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-cyan-400" />
              <span>Pune, India</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-8">
            <a
              href="#"
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 transition"
            >
              <Github size={20} />
            </a>

            <a
              href="#"
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 transition"
            >
              <Linkedin size={20} />
            </a>

            <a
              href="#"
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 transition"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          <div className="space-y-6">

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Your Message
              </label>

              <textarea
                rows="5"
                placeholder="Tell us about your startup idea..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition resize-none"
              ></textarea>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl transition duration-300">
              Launch Conversation
              <Send size={18} />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;