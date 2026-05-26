import React from 'react';

export default function HeroFrame({ data }) {
  const { personal } = data;
  return (
    <div className="flex flex-col items-center justify-center h-full p-12 bg-gradient-to-br from-gray-900 to-black text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 0%, transparent 70%)' }}></div>
      <img src={personal.avatar} alt={personal.name} className="w-32 h-32 rounded-full mb-6 border-4 border-gray-800 shadow-2xl z-10 object-cover" />
      <h1 className="text-5xl font-bold mb-4 z-10 text-white">{personal.name}</h1>
      <h2 className="text-2xl text-blue-400 font-medium mb-6 z-10">{personal.title}</h2>
      <p className="text-gray-400 max-w-lg z-10 leading-relaxed">
        {personal.shortBio}
      </p>
      <div className="mt-8 flex gap-4 z-10">
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
          View Work
        </button>
        <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium transition-colors">
          Contact Me
        </button>
      </div>
    </div>
  );
}
