import React from 'react';

export default function CharacterStats({ data }) {
  // If we don't have stats explicitly, maybe we skip or derive something.
  // We'll just put a fun decorative section if we have some data, else return null.
  if (!data?.personal) return null;

  const stats = [
    { label: 'INT', value: 95 },
    { label: 'AGI', value: 85 },
    { label: 'STR', value: 70 },
    { label: 'STA', value: 90 },
    { label: 'LUK', value: 99 },
  ];

  return (
    <section className="relative w-full">
      <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-4">
        <span className="bg-black text-white px-4 py-1">CHARACTER</span>
        <span>STATS</span>
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="border-4 border-black bg-white p-4 text-center transform transition-transform hover:scale-110">
            <div className="text-lg font-black uppercase text-gray-500 mb-2">{stat.label}</div>
            <div className="text-4xl font-black manga-title">{stat.value}</div>
            {/* simple power bar */}
            <div className="mt-2 w-full h-2 bg-gray-200 border-2 border-black">
              <div 
                className="h-full bg-black" 
                style={{ width: `${stat.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
