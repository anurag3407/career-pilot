import React from "react";

export const GlassCard = ({
  children,
  variant = "default",
  className = "",
}) => {
  // Reusable GlassCard component with glassmorphism variants

  const baseStyles =
    "relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300";

  const variants = {
    default:
      "bg-white/10 dark:bg-black/20 border-white/20 shadow-lg",

    highlighted:
      "bg-white/20 dark:bg-black/30 border-cyan-400/30 shadow-2xl",

    interactive:
      "bg-white/10 dark:bg-black/20 border-white/20 hover:scale-[1.02] hover:shadow-xl cursor-pointer",
  };

  return (
    <div
      className={`group ${baseStyles} ${
        variants[variant] ?? variants.default
      } ${className}`}
    >
      {variant === "interactive" && (
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;