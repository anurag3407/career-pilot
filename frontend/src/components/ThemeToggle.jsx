/**
 * ThemeToggle — Animated Sun/Moon toggle button.
 * Works with the existing ThemeContext / useTheme hook.
 *
 * Props:
 *   size      – "sm" | "md" (default) | "lg"
 *   className – optional extra Tailwind classes
 */
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const sizeMap = {
  sm:  { btn: "p-1.5", icon: "w-4 h-4" },
  md:  { btn: "p-2",   icon: "w-5 h-5" },
  lg:  { btn: "p-2.5", icon: "w-6 h-6" },
};

export default function ThemeToggle({ size = "md", className = "" }) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { btn, icon } = sizeMap[size] ?? sizeMap.md;
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`
        relative ${btn} rounded-xl
        bg-muted hover:bg-accent
        border border-border
        text-foreground
        cursor-pointer overflow-hidden
        transition-colors duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        ${className}
      `}
    >
      {/* Subtle radial glow on hover */}
      <span
        className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
          isDark
            ? "bg-[radial-gradient(circle_at_center,rgba(250,204,21,.15),transparent_70%)] opacity-0 hover:opacity-100"
            : "bg-[radial-gradient(circle_at_center,rgba(99,102,241,.12),transparent_70%)] opacity-0 hover:opacity-100"
        }`}
      />

      {/* Animated icon swap */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={resolvedTheme}
          initial={{ y: 18, opacity: 0, rotate: 45, scale: 0.7 }}
          animate={{ y: 0,  opacity: 1, rotate: 0,  scale: 1   }}
          exit={{   y: -18, opacity: 0, rotate: -45, scale: 0.7 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          {isDark ? (
            <Sun className={`${icon} text-amber-300`} />
          ) : (
            <Moon className={`${icon} text-indigo-500`} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

