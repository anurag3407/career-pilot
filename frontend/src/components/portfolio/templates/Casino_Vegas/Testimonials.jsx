import React from "react";
import { Quote } from "lucide-react";

export default function Testimonials({ data }) {
  if (!data?.testimonials || data.testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#050505] py-20 px-6 text-white border-y border-yellow-500/20">
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-600/10 blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.9)]">
            High Praises
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            What the VIPs are saying.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-[32px] border border-yellow-500/20 bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/50 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]"
            >
              <Quote className="mb-6 text-red-500 opacity-60" size={40} />
              
              <p className="mb-8 text-lg italic leading-relaxed text-gray-300">
                "{testimonial.text || testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name || testimonial.author}
                    className="h-14 w-14 rounded-full border-2 border-yellow-500/50 object-cover"
                  />
                )}
                <div>
                  <h4 className="font-bold text-yellow-300">
                    {testimonial.name || testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role || testimonial.position}</p>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full border-[6px] border-red-500/20 transition-transform duration-500 group-hover:scale-110"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
