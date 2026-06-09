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
      "bg-card/50 border-border/60 shadow-lg",

    highlighted:
      "bg-card/70 border-primary/20 shadow-2xl",

    interactive:
      "bg-card/50 border-border/60 hover:scale-[1.02] hover:shadow-xl hover:border-primary/30 cursor-pointer",
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