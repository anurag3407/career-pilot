import React from "react";
import { Sparkles } from "lucide-react";
export default function ConfidenceMeter({ confidence = 0 }) {

  const color =
    confidence < 40
      ? "text-red-400"
      : confidence < 70
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div
      className={`mt-4 p-5 rounded-2xl bg-[#111827] border border-gray-700 transition-all duration-500 shadow-lg ${
        confidence > 0 ? "animate-pulse" : ""
      }`}
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-4">

        <h2 className="text-white font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          Confidence Meter
        </h2>

        <span className={`font-bold text-xl transition-all duration-500 ${color}`}>
          {Math.round(confidence)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden shadow-inner">

        <div
          className={`h-full transition-all duration-700 ease-in-out bg-gradient-to-r ${
            confidence < 40
              ? "from-red-500 to-pink-500"
              : confidence < 70
              ? "from-yellow-400 to-orange-400"
              : "from-green-400 to-emerald-500"
          }`}
          style={{
            width: `${confidence}%`,
            boxShadow:
              confidence < 40
                ? "0 0 15px rgba(239,68,68,0.7)"
                : confidence < 70
                ? "0 0 15px rgba(250,204,21,0.7)"
                : "0 0 15px rgba(34,197,94,0.7)",
          }}
        />
      </div>

      {/* Status */}
      <p className={`mt-4 text-sm font-medium transition-all duration-500 ${color}`}>
        {confidence < 40
          ? "⚠ Try maintaining eye contact"
          : confidence < 70
          ? "👍 Good confidence level"
          : "🔥 Excellent communication"}
      </p>

      {/* Face Detection */}
      <div className="mt-2 text-xs text-gray-400">
        {confidence > 20
          ? "✅ Face Detected"
          : "❌ Face Not Visible"}
      </div>
    </div>
  );
}