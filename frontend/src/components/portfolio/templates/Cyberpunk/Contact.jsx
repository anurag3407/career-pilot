import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
} from "lucide-react";

export default function Contact() {
  return (
    <section className="relative overflow-hidden bg-[#070b14] py-20 px-6 md:px-12">
      
      {/* Neon Background Effects */}
      <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-pink-500/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-6xl">
        
        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="mb-3 tracking-[0.3em] text-cyan-400 uppercase text-sm">
            Contact Interface
          </p>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white">
            Let’s Build The
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              {" "}
              Future
            </span>
          </h2>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto">
            Ready to collaborate on futuristic digital experiences, innovative
            products, and next-gen solutions.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-10 lg:grid-cols-2">
          
          {/* Contact Info */}
          <div className="space-y-6">
            
            <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.08)]">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                  <Mail size={24} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <h3 className="text-lg font-semibold text-white">
                    cyberpunk@example.com
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-pink-400/20 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,200,0.08)]">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
                  <Phone size={24} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <h3 className="text-lg font-semibold text-white">
                    +91 98765 43210
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-purple-400/20 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.08)]">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
                  <MapPin size={24} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <h3 className="text-lg font-semibold text-white">
                    Neo Tokyo, Cyber District
                  </h3>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 pt-4">
              <a
                href="#"
                className="rounded-2xl border border-cyan-400/20 bg-white/5 p-4 text-cyan-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
              >
                <Github size={22} />
              </a>

              <a
                href="#"
                className="rounded-2xl border border-pink-400/20 bg-white/5 p-4 text-pink-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,0,200,0.5)]"
              >
                <Linkedin size={22} />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.08)]">
            
            <form className="space-y-6">
              
              <div>
                <label className="mb-2 block text-sm text-cyan-300">
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-cyan-400/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-pink-300">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-pink-400/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-purple-300">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full rounded-xl border border-purple-400/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30"
                ></textarea>
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 px-6 py-4 font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]"
              >
                Send Message
                <Send
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}