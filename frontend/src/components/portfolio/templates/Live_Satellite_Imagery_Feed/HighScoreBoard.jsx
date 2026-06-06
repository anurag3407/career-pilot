import React from 'react';

export default function HighScoreBoard() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-8 bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-600 mb-4">High Score Board</h2>
        <p className="text-lg text-purple-500">Track satellite imagery analysis achievements</p>
        <p className="mt-4 text-gray-500">Implementation pending. Open an issue to contribute!</p>
      </div>
    </div>
  );
}