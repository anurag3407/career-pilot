import { useState } from "react";

const THEMES = [
  {
    id: "minimal",
    name: "Minimal",
    supportsDarkMode: true,
    lightPreview: "#ffffff",
    darkPreview: "#1a1a1a",
    accent: "#6366f1",
    isPremium: false,
  },
  {
    id: "professional",
    name: "Professional",
    supportsDarkMode: true,
    lightPreview: "#f8fafc",
    darkPreview: "#0f172a",
    accent: "#0ea5e9",
    isPremium: true,
  },
  {
    id: "creative",
    name: "Creative",
    supportsDarkMode: false,
    lightPreview: "#fdf4ff",
    darkPreview: null,
    accent: "#d946ef",
    isPremium: true,
  },
  {
    id: "bold",
    name: "Bold",
    supportsDarkMode: true,
    lightPreview: "#fff7ed",
    darkPreview: "#1c1917",
    accent: "#f97316",
    isPremium: false,
  },
];

export default function ThemeSelector({
  selectedTheme,
  onSelectTheme,
  isDarkPreview,
  setIsDarkPreview,
}) {
  return (
    <div className="w-full p-4">

      {/* Preview Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setIsDarkPreview(false)}
          className={
            !isDarkPreview
              ? "bg-black text-white px-3 py-1"
              : "px-3 py-1"
          }
        >
          Light
        </button>

        <button
          onClick={() => setIsDarkPreview(true)}
          className={
            isDarkPreview
              ? "bg-black text-white px-3 py-1"
              : "px-3 py-1"
          }
        >
          Dark
        </button>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {THEMES.map((t) => {
          const isSelected = selectedTheme === t.id;

          return (
            <div
              key={t.id}
              onClick={() => onSelectTheme(t.id)}
              className={`border p-3 cursor-pointer transition ${
                isSelected
                  ? "border-blue-500 scale-105"
                  : "border-gray-300"
              }`}
            >
              {/* Preview box */}
              <div
                className="h-16 flex items-center justify-center"
                style={{
                  backgroundColor:
                    isDarkPreview && t.supportsDarkMode
                      ? t.darkPreview
                      : t.lightPreview,
                }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: t.accent }}
                />
              </div>

              {/* Name */}
              <p className="mt-2 text-sm font-medium">
                {t.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}