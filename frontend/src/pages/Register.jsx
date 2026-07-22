import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function Register() {
  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative overflow-hidden items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.92)_0%,_rgba(0,0,0,0.7)_50%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <SignUp routing="path" path="/register" signInUrl="/login" />
      </div>
    </div>
  );
}
