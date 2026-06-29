import React from 'react';

export default function About({ data }) {
  if (!data?.personal?.about) return null;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 mt-4">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About Me</h3>
      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p className="whitespace-pre-line leading-relaxed">
          {data.personal.about}
        </p>
      </div>
    </div>
  );
}
