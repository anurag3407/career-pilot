import React from 'react';

export default function Contact() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-red-300 rounded-xl p-8 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Get in Touch</h2>
        <p className="text-lg text-red-500">Collaborate on satellite imagery and Earth observation projects</p>
        <p className="mt-4 text-gray-500">Implementation pending. Open an issue to contribute!</p>
      </div>
    </div>
  );
}
