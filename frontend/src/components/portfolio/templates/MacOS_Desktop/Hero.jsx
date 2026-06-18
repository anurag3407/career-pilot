import React from 'react';

export default function Hero({ data }) {
  if (!data?.personal) return null;
  const { name, role, bio, avatar } = data.personal;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 p-6">
      {avatar && (
        <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
          <img 
            src={avatar} 
            alt={name} 
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
          />
        </div>
      )}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
          {name}
        </h1>
        <h2 className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-medium mb-4">
          {role}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
          {bio}
        </p>
      </div>
    </div>
  );
}
