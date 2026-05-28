import React from "react";
import {
  Mail,
  Phone,
  Instagram,
  ArrowUpRight,
} from "lucide-react";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="relative overflow-hidden bg-black text-white py-20 px-6 md:px-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-neutral-900 opacity-95" />
      <div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 grid md:grid-cols-2 gap-14 items-center max-w-7xl mx-auto">

        {/* Left Content */}
        <div>
          <p className="uppercase tracking-[0.3em] text-amber-400 text-sm mb-4">
            Contact
          </p>

          <h1 className="text-5xl md:text-7xl font-light leading-tight">
            Let’s Create
            <span className="block italic text-amber-200">
              Something Timeless
            </span>
          </h1>

          <p className="mt-8 text-zinc-400 text-lg max-w-md leading-relaxed">
            Crafted for visionaries, brands, and creators seeking refined
            digital experiences with a luxury aesthetic.
          </p>

          {/* Contact Info */}
          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4 text-zinc-300">
              <Mail className="w-5 h-5 text-amber-400" />
              hello@fashionstudio.com
            </div>

            <div className="flex items-center gap-4 text-zinc-300">
              <Phone className="w-5 h-5 text-amber-400" />
              +91 98765 43210
            </div>

            <div className="flex items-center gap-4 text-zinc-300">
              <Instagram className="w-5 h-5 text-amber-400" />
              @highfashion
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label
                htmlFor="fullName"
                className="text-sm uppercase tracking-widest text-zinc-400"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Enter your name"
                className="mt-3 w-full bg-transparent border-b border-zinc-700 focus:border-amber-400 outline-none py-3 text-white placeholder:text-zinc-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm uppercase tracking-widest text-zinc-400"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-3 w-full bg-transparent border-b border-zinc-700 focus:border-amber-400 outline-none py-3 text-white placeholder:text-zinc-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-sm uppercase tracking-widest text-zinc-400"
              >
                Message
              </label>

              <textarea
                id="message"
                rows="4"
                placeholder="Tell us about your vision..."
                className="mt-3 w-full bg-transparent border-b border-zinc-700 focus:border-amber-400 outline-none py-3 text-white placeholder:text-zinc-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="group mt-6 inline-flex items-center gap-3 border border-amber-400 text-amber-300 px-8 py-4 rounded-full hover:bg-amber-400 hover:text-black transition duration-300"
            >
              Submit Inquiry

              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}