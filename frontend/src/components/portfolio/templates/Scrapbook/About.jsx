import { Heart, MapPin, Pencil, Sparkles } from "lucide-react";

export default function About() {
return ( 
<section className="max-h-screen relative overflow-hidden bg-[#fdf6ec] px-6 py-20 md:px-12 lg:px-24">

  <div className="absolute left-6 top-10 h-16 w-16 rotate-12 rounded-full border-4 border-dashed border-pink-300 opacity-40"></div>
  <div className="absolute bottom-10 right-10 h-20 w-20 rotate-45 rounded-xl border-4 border-yellow-300 opacity-40"></div>

  <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
    
    {/* Scrapbook Image Card */}
    <div className="relative mx-auto w-full max-w-md">
      
      {/* Tape */}
      <div className="absolute -top-5 left-10 z-20 h-10 w-28 rotate-8 bg-yellow-200/80 shadow-md"></div>

      {/* Back Paper */}
      <div className="absolute left-4 top-4 h-full w-full rotate-4 rounded-4xl bg-pink-200 shadow-xl"></div>

      {/* Main Card */}
      <div className="relative rotate-2 rounded-4xl border-4 border-white bg-[#fffaf5] p-5 shadow-2xl transition-transform duration-500 hover:rotate-0">
        
        <div className="rounded-3xl bg-linear-to-br from-pink-200 via-orange-100 to-yellow-100 p-6">
          
          <div className="flex h-72 items-center justify-center rounded-3xl border-4 border-white bg-white shadow-inner">
            <div className="text-center">
              <Sparkles className="mx-auto mb-4 h-14 w-14 text-pink-500" />
              <p className="text-lg font-bold text-gray-700">
                Your Creative Snapshot
              </p>
            </div>
          </div>

          {/* Caption */}
          <p className="mt-5 -rotate-2 text-center text-lg font-semibold text-gray-700">
            “Collecting moments, building dreams ✨”
          </p>
        </div>
      </div>
    </div>

    {/* About Content */}
    <div className="relative">
      
      {/* Heading */}
      <div className="mb-8 inline-block -rotate-2 rounded-2xl bg-pink-300 px-6 py-3 shadow-lg">
        <h2 className="text-3xl font-black tracking-wide text-gray-800 md:text-5xl">
          About Me
        </h2>
      </div>

      {/* Main Text */}
      <div className="relative rotate-1 rounded-4xl border-4 border-dashed border-orange-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        
        {/* Tape */}
        <div className="absolute -top-4 right-8 h-8 w-20 rotate-12 bg-yellow-200/80 shadow"></div>

        <p className="mb-6 text-lg leading-relaxed text-gray-700">
          I'm a passionate creator who loves transforming ideas into
          meaningful digital experiences. From playful interfaces to
          polished products, I enjoy blending creativity with technology.
        </p>

        <p className="mb-8 text-lg leading-relaxed text-gray-700">
          My scrapbook is filled with sketches, experiments, colorful
          inspirations, and unforgettable projects that reflect my journey
          as a developer and designer.
        </p>
        <div className="flex flex-wrap gap-4">
          
          <div className="flex items-center gap-2 -rotate-3 rounded-full bg-pink-100 px-4 py-2 shadow-md">
            <Heart className="h-4 w-4 text-pink-500" />
            <span className="font-medium text-gray-700">
              UI/UX Lover
            </span>
          </div>

          <div className="flex items-center gap-2 rotate-2 rounded-full bg-yellow-100 px-4 py-2 shadow-md">
            <Pencil className="h-4 w-4 text-orange-500" />
            <span className="font-medium text-gray-700">
              Creative Thinker
            </span>
          </div>

          <div className="flex items-center gap-2 -rotate-2 rounded-full bg-green-100 px-4 py-2 shadow-md">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="font-medium text-gray-700">
              Based Somewhere Awesome
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section> );
}