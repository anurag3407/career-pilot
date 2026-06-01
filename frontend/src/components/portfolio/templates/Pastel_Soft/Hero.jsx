return (
  <section className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center px-6 py-12">
    
    <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
      
      {/* Left Content */}
      <div>
        <p className="text-purple-500 font-semibold text-lg mb-4">
          Hello, I'm
        </p>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
          Meghana <br />
          Frontend Developer
        </h1>

        <p className="mt-6 text-gray-600 text-lg leading-relaxed">
          I create beautiful, modern and responsive web experiences
          with clean UI and smooth user interaction.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap">
          <button className="px-6 py-3 rounded-full bg-purple-400 text-white font-medium hover:bg-purple-500 transition">
            View Projects
          </button>

          <button className="px-6 py-3 rounded-full border border-purple-400 text-purple-600 font-medium hover:bg-purple-100 transition">
            Contact Me
          </button>
        </div>
      </div>

      {/* Right Side Card */}
      <div className="flex justify-center">
        <div className="w-[320px] h-[320px] rounded-[40px] bg-white/40 backdrop-blur-lg shadow-2xl flex items-center justify-center">
          
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-purple-300 mx-auto mb-6"></div>

            <h2 className="text-2xl font-bold text-gray-700">
              Creative Designer
            </h2>

            <p className="mt-3 text-gray-500">
              Soft pastel modern portfolio UI
            </p>
          </div>

        </div>
      </div>

    </div>

  </section>
);
