import React from "react";

export default function ResumeCTA() {
  return (
    <section className="relative overflow-hidden bg-[#1a0f0b] px-6 py-20 text-white">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-red-500/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center rounded-3xl border border-orange-400/20 bg-white/5 p-10 text-center backdrop-blur-lg">

        {/* Small Tag */}
        <span className="mb-4 rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-sm text-orange-300">
          Culinary Restaurant Portfolio
        </span>

        {/* Heading */}
        <h2 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
          Let’s Create a Delicious Digital Experience
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          Passionate about blending elegant UI design with restaurant-inspired
          creativity. Build your next culinary brand with modern frontend
          experiences and responsive layouts.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          
          <button className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 text-lg font-semibold transition hover:scale-105">
            Hire Me
          </button>

          <button className="rounded-full border border-white/20 px-8 py-3 text-lg font-semibold transition hover:bg-white hover:text-black">
            Download Resume
          </button>

        </div>

        {/* Decorative Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
            <h3 className="mb-2 text-xl font-bold text-orange-300">
              Modern UI
            </h3>
            <p className="text-gray-400">
              Elegant restaurant-inspired interfaces with responsive layouts.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
            <h3 className="mb-2 text-xl font-bold text-orange-300">
              Creative Branding
            </h3>
            <p className="text-gray-400">
              Unique visual identity with food-inspired design aesthetics.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
            <h3 className="mb-2 text-xl font-bold text-orange-300">
              Fast Performance
            </h3>
            <p className="text-gray-400">
              Optimized frontend experiences for smooth user interaction.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}