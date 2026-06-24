import { useState } from "react";
import {
  ArrowUpRight,
  ShoppingCart,
  Star,
  Heart,
  Sparkles,
} from "lucide-react";

const projects = [
  {
    id: 1,
    number: "01",
    emoji: "💼",
    title: "AI Resume Builder",
    subtitle: "Land interviews faster",
    description:
      "Generates ATS-friendly resumes tailored to job descriptions with AI-powered optimization and stunning modern templates.",
    price: "$29",
    slashPrice: "$59",
    tag: "Best Seller",
    tech: ["React", "OpenAI", "Node.js"],
    color: "#f97316",
    lightBg: "#fff7ed",
  },
  {
    id: 2,
    number: "02",
    emoji: "🎨",
    title: "Portfolio Generator",
    subtitle: "Live in 3 minutes",
    description:
      "Build and launch beautiful portfolio websites instantly using drag-and-drop sections and premium themes.",
    price: "$19",
    slashPrice: "$49",
    tag: "New Arrival",
    tech: ["Next.js", "Tailwind", "Vercel"],
    color: "#8b5cf6",
    lightBg: "#f5f3ff",
  },
  {
    id: 3,
    number: "03",
    emoji: "🤖",
    title: "Interview Assistant",
    subtitle: "Practice until perfect",
    description:
      "AI mock interviews with real-time feedback on tone, confidence, communication, and technical responses.",
    price: "$39",
    slashPrice: "$79",
    tag: "Trending",
    tech: ["Python", "Whisper", "GPT-4"],
    color: "#10b981",
    lightBg: "#ecfdf5",
  },
];

export default function Projects() {
  const [cart, setCart] = useState([]);

  function toggle(id) {
    setCart((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  return (
    <section className="relative min-h-screen pb-24 overflow-hidden bg-gradient-to-br from-stone-50 via-orange-50 to-stone-100 py-10 px-5">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-orange-300/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-emerald-300/20 blur-[140px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="relative mb-10 border-b border-stone-300 pb-8">

          {/* Cart Button */}
          <div
            className="hidden lg:inline-flex absolute right-0 top-0 items-center gap-3 border border-stone-300 bg-white/70 backdrop-blur-xl rounded-full px-5 py-3 shadow-sm"
            style={{ fontFamily: "sans-serif" }}
          >

            <ShoppingCart size={18} className="text-stone-700" />

            <span className="text-sm font-semibold text-stone-700">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
            </span>

          </div>

          {/* Center Content */}
          <div className="flex flex-col items-center text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-stone-300 bg-white/70 backdrop-blur-xl rounded-full px-5 py-2 mb-6 shadow-sm">

              <Sparkles size={16} className="text-orange-500" />

              <span
                className="text-sm font-semibold text-stone-700"
                style={{ fontFamily: "sans-serif" }}
              >
                Premium Ecommerce Showcase
              </span>

            </div>

            {/* Heading */}
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-stone-900">

              Featured{" "}

              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-emerald-500 bg-clip-text text-transparent">
                Projects
              </span>

            </h2>

            {/* Description */}
            <p
              className="mt-6 text-stone-500 max-w-xl text-lg leading-relaxed"
              style={{ fontFamily: "sans-serif" }}
            >
              Carefully crafted premium digital products inspired by modern ecommerce experiences with sleek UI, immersive interactions, and luxury aesthetics.
            </p>

          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.map((p) => {
            const inCart = cart.includes(p.id);

            return (
              <div
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-[32px] border border-stone-200/50 bg-white/80 backdrop-blur-2xl hover:scale-[1.01] hover:border-stone-900 transition-all duration-500 hover:shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
              >

                {/* Hover Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}15, transparent)`,
                  }}
                ></div>

                {/* Product Area */}
                <div
                  className="relative flex flex-col items-center justify-center px-6 py-7 overflow-hidden"
                  style={{ background: p.lightBg }}
                >

                  {/* Huge Number */}
                  <span
                    className="absolute bottom-0 right-4 text-7xl font-black opacity-10 select-none"
                    style={{
                      color: p.color,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {p.number}
                  </span>

                  {/* Wishlist */}
                  <button 
                    aria-label="Add to wishlist"
                    onClick={() => {/* implement wishlist toggle */}}
                    className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl flex items-center justify-center shadow-md hover:scale-110 transition"
                  >

                    <Heart
                      size={18}
                      className="text-stone-700"
                    />

                  </button>

                  {/* Tag */}
                  <div
                    className="mb-7 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${p.color}, #111)`,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {p.tag}
                  </div>

                  {/* Product Icon */}
                  <div
                    className="w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${p.color}, white)`,
                    }}
                  >

                    <span className="text-6xl">
                      {p.emoji}
                    </span>

                  </div>
                </div>

                {/* Content */}
                <div className="relative flex flex-col flex-1 p-5">

                  {/* Subtitle */}
                  <p
                    className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-2"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {p.subtitle}
                  </p>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-stone-900 mb-3 leading-tight">
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-stone-500 leading-relaxed text-sm mb-4"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {p.description}
                  </p>

                  {/* Tech Stack */}
                  <div
                    className="flex flex-wrap gap-2 mb-6"
                    style={{ fontFamily: "sans-serif" }}
                  >

                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-semibold border border-stone-200 bg-stone-50 text-stone-500 px-3 py-1 rounded-full hover:border-stone-400 transition"
                      >
                        {t}
                      </span>
                    ))}

                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-5">

                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}

                    <span
                      className="text-xs text-stone-400 ml-1"
                      style={{ fontFamily: "sans-serif"}}
                    >
                      5.0 Rating
                    </span>

                  </div>

                  <div className="flex-1"></div>

                  {/* Pricing */}
                  <div className="border-t border-stone-100 pt-5">

                    <div className="flex items-end justify-between mb-5">

                      <div>

                        <p
                          className="text-sm text-stone-400 line-through mb-1"
                          style={{ fontFamily: "sans-serif" }}
                        >
                          {p.slashPrice}
                        </p>

                        <h4
                          className="text-3xl font-black"
                          style={{
                            color: p.color,
                            fontFamily: "sans-serif",
                          }}
                        >
                          {p.price}
                        </h4>

                      </div>

                      <div
                        className="text-xs text-stone-400"
                        style={{ fontFamily: "sans-serif" }}
                      >
                        Lifetime Access
                      </div>

                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => toggle(p.id)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-95 hover:scale-[1.02] shadow-xl"
                      style={{
                        fontFamily: "sans-serif",
                        background: inCart
                          ? "#111"
                          : `linear-gradient(135deg, ${p.color}, #111)`,
                        color: "#fff",
                      }}
                    >

                      <ShoppingCart size={15} />

                      {inCart ? "Added To Cart ✓" : "Add To Cart"}

                    </button>

                    {/* Secondary CTA */}
                    <button
                      type="button"
                      aria-disabled="true"
                      title="Project preview coming soon"
                      className="w-full flex items-center justify-center gap-2 mt-3 text-sm font-semibold text-stone-400 cursor-not-allowed"
                      style={{ fontFamily: "sans-serif" }}
                    >

                      Preview Coming Soon

                      <ArrowUpRight
                        size={15}
                        className="opacity-50"
                      />

                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="mt-10 pt-8 border-t border-stone-300 flex flex-col md:flex-row items-start md:items-center justify-center gap-5"
          style={{ fontFamily: "sans-serif" }}
        >

        <p className="text-sm text-stone-400">
          Showing {projects.length} premium featured projects
        </p>

        <button  
        type="button"
        aria-disabled="true"
        title="Full collection coming soon"
        className="flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 py-2 text-sm font-bold text-stone-500 cursor-not-allowed">

          Full Collection Coming Soon

          <ArrowUpRight
            size={16}
            className="opacity-50"
          />

        </button>

        </div>
      </div>
    </section>
  );
}
