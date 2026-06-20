import React from 'react';
import { Quote } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { FadeIn } from './shared';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-12">
      <FadeIn>
        <div className="flex items-center gap-4 mb-16">
          <Quote size={20} strokeWidth={1} className="text-zinc-400" />
          <h3 className="text-xl font-light uppercase tracking-widest">Feedback</h3>
          <div className="flex-1 border-t border-zinc-200 ml-4"></div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.testimonials.map((testimonial, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <div className="border border-zinc-200 p-10 h-full flex flex-col relative group hover:border-zinc-400 transition-colors duration-300">
              <Quote size={32} strokeWidth={0.5} className="text-zinc-200 mb-8" />
              <p className="text-zinc-500 font-light italic mb-12 flex-grow leading-loose">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="p-1 border border-zinc-200">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 object-cover grayscale" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-900 tracking-wide">{testimonial.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
