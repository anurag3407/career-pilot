import React from 'react';

export default function Hero() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-4">Live Satellite Imagery Feed</h2>
        <p className="text-lg text-blue-500">Real-time Earth observation and satellite data visualization</p>
        <p className="mt-4 text-gray-500">Implementation pending. Open an issue to contribute!</p>
      </div>
    </div>
  );
}
