import React from 'react';

export default function Projects() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold text-purple-900 mb-4">
            Featured Projects
          </h2>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            A watercolor-inspired showcase of creative works, artistic ideas,
            and beautiful digital experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/30 hover:scale-105 transition duration-300">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
              alt="Project"
              className="rounded-2xl mb-4 h-52 w-full object-cover"
            />

            <h3 className="text-2xl font-semibold text-purple-900 mb-2">
              Artistic Portfolio
            </h3>

            <p className="text-gray-700">
              A modern watercolor-inspired portfolio website with elegant visual storytelling.
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/30 hover:scale-105 transition duration-300">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
              alt="Project"
              className="rounded-2xl mb-4 h-52 w-full object-cover"
            />

            <h3 className="text-2xl font-semibold text-pink-900 mb-2">
              Creative Dashboard
            </h3>

            <p className="text-gray-700">
              A colorful and intuitive dashboard designed for designers and creators.
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/30 hover:scale-105 transition duration-300">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Project"
              className="rounded-2xl mb-4 h-52 w-full object-cover"
            />

            <h3 className="text-2xl font-semibold text-blue-900 mb-2">
              Team Collaboration
            </h3>

            <p className="text-gray-700">
              A smooth collaborative workspace with calming watercolor aesthetics.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
