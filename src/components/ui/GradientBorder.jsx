import { cn } from "@/lib/utils";

export default function GradientBorder({ children, className = "", borderClassName = "" }) {
  return (
    <div className={cn("relative group", className)}>
      <div
        className={cn(
          "absolute -inset-[1px] rounded-xl bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm",
          borderClassName
        )}
      />
      <div
        className={cn(
          "absolute -inset-[1px] rounded-xl bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          borderClassName
        )}
      />
      {children}
    </div>
  );
}

export function GlowCard({ children, className = "" }) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
      <div className="relative bg-card rounded-2xl border border-border group-hover:border-primary/50 transition-colors duration-300">
        {children}
      </div>
    </div>
  );
}
