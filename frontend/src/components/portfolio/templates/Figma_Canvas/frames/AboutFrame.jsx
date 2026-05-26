import React from 'react';
import { MapPin, Briefcase } from 'lucide-react';

export default function AboutFrame({ data }) {
  const { personal, stats } = data;
  return (
    <div className="h-full p-10 bg-[#1A1A1A] flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-800 pb-4">About Me</h2>
        <p className="text-gray-300 leading-relaxed text-lg mb-8">
          {personal.bio}
        </p>
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <MapPin size={18} className="text-blue-500" />
          <span>{personal.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 mb-8">
          <Briefcase size={18} className="text-blue-500" />
          <span>{personal.availability}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#252525] p-4 rounded-lg border border-[#333]">
          <div className="text-3xl font-bold text-white mb-1">{stats.yearsExperience}+</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Years Exp</div>
        </div>
        <div className="bg-[#252525] p-4 rounded-lg border border-[#333]">
          <div className="text-3xl font-bold text-white mb-1">{stats.projectsCompleted}+</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Projects</div>
        </div>
        <div className="bg-[#252525] p-4 rounded-lg border border-[#333]">
          <div className="text-3xl font-bold text-white mb-1">{stats.happyClients}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Clients</div>
        </div>
        <div className="bg-[#252525] p-4 rounded-lg border border-[#333]">
          <div className="text-3xl font-bold text-white mb-1">{stats.coffeeConsumed}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Coffees</div>
        </div>
      </div>
    </div>
  );
}
