import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

export default function Testimonials() {
  const { portfolioData: data } = usePortfolio();
  const testimonials = data?.testimonials || [];

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-rose-100 shadow-sm text-rose-500 font-medium text-sm tracking-wide mb-6">
            Words from others
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-700 tracking-tight">
            Testimonials
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              <div className="text-rose-300 mb-6">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="text-slate-600 leading-relaxed italic flex-grow mb-6">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 font-bold text-xl">
                  {testimonial.author?.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">{testimonial.author}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}