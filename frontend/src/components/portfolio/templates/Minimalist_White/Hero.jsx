import React from 'react';

export default function Hero({ data }) {
  if (!data || !data.personal) return null;
  const { personal } = data;

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-white text-gray-900">
      <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
        {personal.name}
      </h1>
      <p className="text-xl md:text-2xl font-light text-gray-500 max-w-2xl tracking-wide">
        {personal.role || 'Professional'}
      </p>
      {personal.bio && (
        <p className="mt-8 text-lg text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
          {personal.bio}
        </p>
      )}
    </section>
  );
}
