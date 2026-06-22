import React from "react";

const colors = [
  {
    name: "Lavender Dream",
    hex: "#CDB4DB",
  },
  {
    name: "Peach Glow",
    hex: "#FFC8A2",
  },
  {
    name: "Sky Mist",
    hex: "#A2D2FF",
  },
  {
    name: "Mint Splash",
    hex: "#BDE0C4",
  },
  {
    name: "Rose Blush",
    hex: "#FFAFCC",
  },
  {
    name: "Soft Sand",
    hex: "#E9D8A6",
  },
];

const PaintPalette = () => {
  return (
    <section className="relative overflow-hidden py-24 px-6 md:px-12 bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
      {/* Artistic Watercolor Splash Blobs */}

      <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-pink-400 opacity-40 blur-[120px] rounded-full"></div>

      <div className="absolute top-40 right-0 w-[380px] h-[380px] bg-cyan-400 opacity-40 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-purple-400 opacity-60 blur-[110px] rounded-full"></div>

      <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-yellow-300 opacity-50 blur-[100px] rounded-full"></div>

      <div className="absolute bottom-10 right-1/4 w-[280px] h-[280px] bg-rose-300 opacity-60 blur-[90px] rounded-full"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black italic  tracking-wide text-gray-800 mb-4">
            Watercolor Paint Palette
          </h2>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            A dreamy collection of soft watercolor-inspired shades crafted for
            artistic and elegant portfolio designs.
          </p>
        </div>

        {/* Color Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {colors.map((color, index) => (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-xl rounded-[30px] p-8 shadow-[0_10px_40px_rgba(255,182,193,0.35)] hover:scale-105  hover:rotate-1 hover:-translate-y-2 transition-all duration-500 border border-white/40"
            >
              {/* Color Circle */}
              <div
                className="w-28 h-28 rounded-full mx-auto mb-6 shadow-2xl border-4 border-white/50"
                style={{
                  backgroundColor: color.hex,
                  boxShadow: `0 0 30px ${color.hex}`,
                }}
              ></div>

              {/* Color Name */}
              <h3 className="text-2xl font-bold italic text-center text-gray-800 mb-2">
                {color.name}
              </h3>

              {/* Hex Code */}
              <p className="text-center text-gray-600 font-medium">
                {color.hex}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaintPalette;
