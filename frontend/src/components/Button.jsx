import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "default",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-black tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-2xl";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary:
      "bg-card border-2 border-border text-foreground hover:bg-muted hover:border-primary/50",
    danger:
      "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20",
    outline: "border-2 border-border text-foreground hover:bg-muted",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
    gradient:
      "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-105 shadow-xl shadow-primary/25",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={disabled || loading ? {} : { scale: 1.03 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
