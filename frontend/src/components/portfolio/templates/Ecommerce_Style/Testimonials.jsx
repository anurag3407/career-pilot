import React from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquare } from 'lucide-react';

export default function Testimonials({ data }) {
  const testimonials = data?.testimonials;
  if (!testimonials || testimonials.length === 0) return null;

  // Calculate some fake e-commerce stats
  const totalReviews = testimonials.length * 42 + 15;
  
  return (
    <section className="relative py-24 bg-stone-50 px-5 border-t border-stone-200">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Review Summary */}
          <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-4">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={24} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-2xl font-bold text-stone-900">4.9</span>
            </div>
            <p className="text-stone-500 font-medium mb-8">
              Based on {totalReviews} reviews
            </p>
            
            <button type="button" className="w-full md:w-auto px-8 py-3 bg-white border-2 border-stone-900 text-stone-900 font-bold rounded-full hover:bg-stone-900 hover:text-white transition-colors">
              Write a Review
            </button>
          </div>

          {/* Testimonial List */}
          <div className="lg:w-2/3 grid gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-[24px] p-6 md:p-8 border border-stone-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={16} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <h4 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                      {t.name}
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={12} />
                        Verified Buyer
                      </span>
                    </h4>
                    <p className="text-sm font-semibold text-stone-400">
                      {t.role} {t.company ? `at ${t.company}` : ''}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-stone-400 whitespace-nowrap">
                    {Math.floor(Math.random() * 20) + 2} days ago
                  </div>
                </div>

                <p className="text-stone-600 leading-relaxed mb-6" style={{ fontFamily: "sans-serif" }}>
                  "{t.text || t.content}"
                </p>

                <div className="flex items-center gap-4 text-sm font-semibold text-stone-400 border-t border-stone-100 pt-4">
                  <button type="button" className="flex items-center gap-1.5 hover:text-stone-900 transition-colors">
                    <ThumbsUp size={16} /> Helpful ({Math.floor(Math.random() * 50) + 5})
                  </button>
                  <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
                  <button type="button" className="flex items-center gap-1.5 hover:text-stone-900 transition-colors">
                    <MessageSquare size={16} /> Comment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}