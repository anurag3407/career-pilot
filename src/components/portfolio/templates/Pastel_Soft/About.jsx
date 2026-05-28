import React from 'react';
import {User, Brain, Code, FlaskConical } from 'lucide-react';

export default function About() {
  const features = [
    {
      title: "Problem Solving",
      description: "DSA & logical thinking",
      icon: <Brain size={20} />,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500"
    },
    {
      title: "Open Source",
      description: "Learning through contribution",
      icon: <Code size={20} />,
      bgColor: "bg-teal-100",
      textColor: "text-teal-500"
    },
    {
      title: "Research Projects",
      description: "Exploring AI & data science",
      icon: <FlaskConical size={20} />,
      bgColor: "bg-rose-100",
      textColor: "text-rose-500"
    }
  ];

  return (
    <>
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-slate-50 to-purple-50 overflow-hidden">
    
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
        
        {/* Left Side: Visual / Avatar */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative group">
            
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-full blur-lg opacity-30 group-hover:opacity-80 transition duration-700 ease-in-out"></div>
            
            {/* Avatar Container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-full border border-slate-200 shadow-lg flex items-center justify-center overflow-hidden">
                
                <User size={120} className="text-pink-200" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Right Side: Content & Text */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          
          {/* Soft Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-pink-100 shadow-sm text-pink-500 font-medium text-sm tracking-wide">
            Get to know me
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-700 tracking-tight">
            About Me
          </h2>
          
          <p className="text-lg text-slate-500 leading-relaxed">
            Currently exploring React, Tailwind CSS, and improving my problem solving skills through competitive programming.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default">
                <div className={`p-3 rounded-xl ${feature.bgColor} ${feature.textColor}`}>
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-slate-700 text-sm">{feature.title}</h4>
                  <p className="text-xs text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  </>
  );
}