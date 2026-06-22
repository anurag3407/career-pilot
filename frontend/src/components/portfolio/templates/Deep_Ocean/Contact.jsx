import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Waves,
  Linkedin,
  Github,
  Twitter,
} from "lucide-react";

export default function Contact() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-900 px-6 py-20 text-white">
      
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-[-120px] top-10 h-80 w-80 rounded-full bg-cyan-500 blur-3xl" />
        <div className="absolute bottom-0 right-[-100px] h-96 w-96 rounded-full bg-blue-600 blur-3xl" />
      </div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute bottom-[-40px] h-4 w-4 animate-bounce rounded-full bg-cyan-300/20"
            style={{
              left: `${i * 8}%`,
              animationDuration: `${4 + (i % 3)}s`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-md">
            <Waves className="h-4 w-4" />
            Deep Ocean Contact
          </div>

          <h2 className="text-4xl font-bold tracking-wide md:text-5xl">
            Let’s Dive Into
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {" "}
              New Ideas
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            Have a project, collaboration, or opportunity in mind? Reach out
            and let’s build something immersive together beneath the digital
            waves.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          
          {/* Contact Info */}
          <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="mb-8 text-2xl font-semibold text-cyan-300">
              Contact Information
            </h3>

            <div className="space-y-6">
              
              <div className="flex items-start gap-4 rounded-2xl border border-cyan-400/10 bg-slate-900/40 p-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10">
                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                  <Mail className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm text-slate-300">
                    hello@deepocean.dev
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-cyan-400/10 bg-slate-900/40 p-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10">
                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-sm text-slate-300">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-cyan-400/10 bg-slate-900/40 p-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10">
                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-sm text-slate-300">
                    Pacific Digital Studio
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-10 flex gap-4">
              {[Linkedin, Github, Twitter].map((Icon, idx) => (
                <button
                  key={idx}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-cyan-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-400/20"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <form className="space-y-6">
              
              <div>
                <label className="mb-2 block text-sm text-cyan-200">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border border-cyan-400/20 bg-slate-900/50 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-cyan-200">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-cyan-400/20 bg-slate-900/50 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-cyan-200">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full rounded-2xl border border-cyan-400/20 bg-slate-900/50 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-medium text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30"
              >
                Send Message

                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}