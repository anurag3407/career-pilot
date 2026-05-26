import React from 'react';
import { Quote } from 'lucide-react';

export default function TestimonialsFrame({ data }) {
  const { testimonials } = data;
  
  return (
    <div className="h-full p-10 bg-[#1A1A1A] overflow-y-auto custom-scrollbar">
      <h2 className="text-3xl font-bold mb-8 text-white">What People Say</h2>
      <div className="space-y-6">
        {testimonials.map((test) => (
          <div key={test.id} className="p-6 rounded-xl border border-[#333] bg-[#252525] relative">
            <Quote className="absolute top-6 right-6 text-[#333] opacity-50" size={40} />
            <p className="text-gray-300 italic mb-6 relative z-10 text-lg leading-relaxed">
              "{test.text}"
            </p>
            <div className="flex items-center gap-4">
              <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full object-cover border border-[#444]" />
              <div>
                <h4 className="font-bold text-white">{test.name}</h4>
                <p className="text-xs text-blue-400">{test.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
