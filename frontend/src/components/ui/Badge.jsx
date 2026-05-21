import { cn } from "@/lib/utils";

const variantStyles = {
  default:   "bg-primary/10 text-primary border-primary/20",
  success:   "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  warning:   "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  error:     "bg-destructive/10 text-destructive border-destructive/20",
  info:      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export default function Badge({ 
  children, 
  variant = "default", 
  size = "sm",
  dot = false,
  className = "",
  ...props 
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium border",
        variantStyles[variant] ?? variantStyles.default,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full bg-current")} />
      )}
      {children}
    </span>
  );
}