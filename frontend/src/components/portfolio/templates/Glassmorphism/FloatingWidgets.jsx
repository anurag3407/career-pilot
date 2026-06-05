import React from "react";
import {
  Sparkles,
  Trophy,
  Briefcase,
  Users,
  TrendingUp,
} from "lucide-react";

export default function FloatingWidgets() {
  const widgets = [
    {
      icon: Sparkles,
      label: "Ideas",
      value: "120+",
      position: "top-6 left-4 md:left-16 animate-pulse",
    },
    {
      icon: Briefcase,
      label: "Projects",
      value: "35+",
      position: "top-16 right-4 md:right-20",
    },
    {
      icon: Trophy,
      label: "Achievements",
      value: "18",
      position: "bottom-20 left-6 md:left-24",
    },
    {
      icon: Users,
      label: "Network",
      value: "500+",
      position: "bottom-6 right-6 md:right-16",
    },
  ];

  return (
    <section className="relative w-full min-h-[500px] overflow-hidden rounded-3xl">
      {/* Background Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative flex items-center justify-center min-h-[500px]">
        {/* Center Widget */}
        <div className="relative flex h-52 w-52 md:h-64 md:w-64 flex-col items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
          <TrendingUp className="mb-3 h-10 w-10 text-cyan-300" />
          <h2 className="text-xl md:text-3xl font-bold text-white">
            Growth
          </h2>
          <p className="text-white/70">+92% This Year</p>
        </div>

        {/* Floating Cards */}
        {widgets.map((widget, index) => {
          const Icon = widget.icon;

          return (
            <div
              key={index}
              className={`absolute ${widget.position}
                rounded-2xl
                border border-white/20
                bg-white/10
                backdrop-blur-xl
                shadow-lg
                px-4 py-3
                transition-all duration-300
                hover:scale-105
                hover:bg-white/15`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-2">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>

                <div>
                  <p className="text-xs text-white/70">
                    {widget.label}
                  </p>
                  <p className="font-semibold text-white">
                    {widget.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}