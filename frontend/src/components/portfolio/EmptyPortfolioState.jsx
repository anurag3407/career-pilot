import React from "react";
import { Globe, Sparkles } from "lucide-react";

const EmptyPortfolioState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
        <Globe className="w-10 h-10 text-blue-600" />
      </div>

      <h2 className="text-3xl font-bold mb-3">
        No portfolios yet
      </h2>

      <p className="text-gray-500 max-w-md mb-8">
        Create your first portfolio from your resume, GitHub, or LinkedIn.
      </p>

      <div className="flex gap-4">
        <button className="px-5 py-2 bg-black text-white rounded-lg">
          From Resume
        </button>

        <button className="px-5 py-2 border rounded-lg">
          From GitHub
        </button>

        <button className="px-5 py-2 border rounded-lg">
          From Scratch
        </button>
      </div>
    </div>
  );
};

export default EmptyPortfolioState;