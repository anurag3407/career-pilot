import { cn } from "@/lib/utils";

const variantStyles = {
  default:  "bg-primary/10 text-primary border-primary/20",
  success:  "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  warning:  "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  danger:   "bg-destructive/10 text-destructive border-destructive/20",
  secondary:"bg-secondary text-secondary-foreground border-border",
  outline:  "bg-transparent text-foreground border-border",
};

export default function Badge({ children, variant = "default", className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}