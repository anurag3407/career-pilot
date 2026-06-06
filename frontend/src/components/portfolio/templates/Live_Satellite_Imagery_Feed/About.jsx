import React from 'react';

export default function About() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-green-300 rounded-xl p-8 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">About Satellite Imagery</h2>
        <p className="text-lg text-green-500">Understanding Earth observation technology</p>
        <p className="mt-4 text-gray-500">Implementation pending. Open an issue to contribute!</p>
      </div>
    </div>
  );
}
