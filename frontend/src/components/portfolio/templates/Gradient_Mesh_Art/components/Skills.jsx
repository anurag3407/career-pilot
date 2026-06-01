import React from "react";
import data from "../../../../../data/dummy_data.json";

export default function Skills() {
  return (
    <section className="py-24 px-6 md:px-20">
      <h2 className="text-4xl font-black text-center mb-12">
        Skills
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {data.skills.map((s, i) => (
          <div
            key={i}
            className="bg-linear-to-br from-violet-800/20 via-blue-800/20 to-rose-800/20 border border-white/10 rounded-2xl p-5"
          >
            <div className="flex justify-between mb-2">
              <span>{s.name}</span>
              <span className="text-purple-300">{s.level}%</span>
            </div>

            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
  <div
    className="absolute inset-y-0 left-0 bg-linear-to-r from-pink-500 via-purple-500 to-cyan-400"
    style={{ width: `${s.level}%` }}
  />
  <div className="absolute inset-0 opacity-30 bg-white/10 animate-pulse" />
</div>

            <p className="text-xs text-gray-400 mt-2">{s.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}