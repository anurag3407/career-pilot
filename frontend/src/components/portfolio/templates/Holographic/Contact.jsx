import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";

export default function Contact() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6 py-20">

      {/* Glow Background Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/20 blur-3xl rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left Content */}
        <div className="flex flex-col justify-center">

          <span className="mb-4 text-sm tracking-[0.3em] uppercase text-cyan-400">
            Contact Me
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Let’s Build Something Futuristic
          </h1>

          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-xl">
            Have a project idea, collaboration, or just want to connect?
            Send a message and let’s create something extraordinary with a
            holographic touch.
          </p>

          {/* Contact Info */}
          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
                <Mail className="text-cyan-400" />
              </div>

              <span className="text-gray-300">
                hello@futureui.com
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
                <Phone className="text-pink-400" />
              </div>

              <span className="text-gray-300">
                +91 98765 43210
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
                <MapPin className="text-purple-400" />
              </div>

              <span className="text-gray-300">
                Chennai, India
              </span>
            </div>

          </div>

          {/* Social Icons */}
          <div className="flex gap-5 mt-10">

            {[
              {
                icon: Github,
                link: "https://github.com/",
              },
              {
                icon: Linkedin,
                link: "https://linkedin.com/",
              },
              {
                icon: Instagram,
                link: "https://instagram.com/",
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 cursor-pointer"
                >
                  <Icon size={22} />
                </a>
              );
            })}

          </div>

        </div>

        {/* Right Form */}
        <div className="relative">

          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30"></div>

          <div className="relative bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.3)]">

            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Send Message
            </h2>

            <form
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >

              <div>

                <label className="sr-only">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 focus:border-cyan-400 outline-none text-white placeholder-gray-400"
                />

              </div>

              <div>

                <label className="sr-only">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 focus:border-pink-400 outline-none text-white placeholder-gray-400"
                />

              </div>

              <div>

                <label className="sr-only">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Your Message"
                  className="w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 focus:border-purple-400 outline-none text-white placeholder-gray-400 resize-none"
                ></textarea>

              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              >
                <Send size={20} />
                Send Message
              </button>

            </form>

          </div>
        </div>
      </div>
    </section>
  );
}