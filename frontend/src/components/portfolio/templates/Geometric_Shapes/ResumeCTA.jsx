import React from "react";
import { Download, Mail, Sparkles, ArrowRight } from "lucide-react";

export default function ResumeCTA() {
  const floatingShapes = [
    {
      className:
        "top-10 left-10 h-24 w-24 border border-cyan-400/30 rotate-45",
    },
    {
      className:
        "bottom-10 right-10 h-20 w-20 border border-fuchsia-400/30 rotate-45",
    },
    {
      className:
        "top-1/2 left-1/4 h-12 w-12 border border-amber-300/30 rounded-full",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#050816] px-6 py-24 text-white">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Floating Shapes */}
      {floatingShapes.map((shape, index) => (
        <div key={index} className={`absolute ${shape.className}`} />
      ))}

      <div className="relative mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-14">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Let's Create Something
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                Amazing
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg text-gray-300">
              Interested in working together? Download my resume or reach out
              directly to discuss opportunities, collaborations, and innovative
              projects.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold transition hover:scale-105">
                <Download size={18} />
                Download Resume
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 font-semibold transition hover:bg-white/10">
                <Mail size={18} />
                Contact Me
              </button>
            </div>

            <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <h3 className="text-3xl font-bold text-cyan-400">50+</h3>
                <p className="text-gray-300">Projects Completed</p>
              </div>

              <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5">
                <h3 className="text-3xl font-bold text-fuchsia-400">3+</h3>
                <p className="text-gray-300">Years Experience</p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                <h3 className="text-3xl font-bold text-amber-400">100%</h3>
                <p className="text-gray-300">Commitment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}