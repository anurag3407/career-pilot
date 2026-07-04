import React from 'react';
import { Package, Truck, CheckCircle, MapPin, Calendar } from 'lucide-react';

export default function Experience({ data }) {
  const experience = data?.experience;
  if (!experience || experience.length === 0) return null;

  return (
    <section className="relative py-24 overflow-hidden bg-stone-50 px-5">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-stone-200/40 blur-[120px] rounded-full"></div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-stone-200 bg-white shadow-sm rounded-full px-5 py-2 mb-6">
            <Truck size={16} className="text-orange-500" />
            <span className="text-sm font-semibold text-stone-700" style={{ fontFamily: "sans-serif" }}>
              Career Logistics
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900 mb-4">
            Track <span className="text-stone-400">Experience</span>
          </h2>
          <p className="text-stone-500 max-w-xl text-lg" style={{ fontFamily: "sans-serif" }}>
            Tracking history of professional milestones and deliveries.
          </p>
        </div>

        {/* Tracking Timeline */}
        <div className="relative border border-stone-200 bg-white/80 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <div className="absolute left-[47px] md:left-[67px] top-12 bottom-12 w-[2px] bg-stone-100"></div>

          <div className="flex flex-col gap-12">
            {experience.map((exp, index) => {
              const isFirst = index === 0;
              return (
                <div key={index} className="relative flex items-start gap-6 md:gap-8 group">
                  {/* Status Icon */}
                  <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${isFirst ? 'bg-orange-500' : 'bg-stone-200'}`}>
                    {isFirst ? (
                      <Truck size={20} className="text-white md:w-6 md:h-6" />
                    ) : (
                      <CheckCircle size={20} className="text-stone-500 md:w-6 md:h-6" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 pt-1 md:pt-3">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 gap-2">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-stone-900">
                          {exp.role || exp.title}
                        </h3>
                        <p className="text-lg font-medium text-stone-500 flex items-center gap-2 mt-1">
                          <Package size={16} className="text-stone-400" />
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-stone-400 bg-stone-100/50 px-3 py-1.5 rounded-full whitespace-nowrap self-start">
                        <Calendar size={14} />
                        {exp.duration || `${exp.startDate} - ${exp.endDate || 'Present'}`}
                      </div>
                    </div>

                    <p className="text-stone-500 leading-relaxed mt-4" style={{ fontFamily: "sans-serif" }}>
                      {exp.description}
                    </p>

                    {/* Metadata / Tracking details */}
                    <div className="mt-5 flex items-center gap-4 border-t border-stone-100 pt-5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400">
                        <MapPin size={14} className="text-stone-300" />
                        Destination: Success
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-200"></div>
                      <div className="text-xs font-semibold text-orange-500">
                        {isFirst ? 'In Transit' : 'Delivered'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}