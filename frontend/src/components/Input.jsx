import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = ''
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-bold text-foreground mb-2 uppercase tracking-widest opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={
            isPassword
              ? showPassword
                ? "Enter password"
                : "••••••••"
              : placeholder
          }
          disabled={disabled}
          className={cn(
            "w-full px-5 py-3.5 rounded-2xl transition-all duration-300",
            "bg-muted/30 border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
            isPassword && "pr-14",
            error ? "border-destructive/50 focus:ring-destructive/20" : "",
            className,
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm font-bold text-destructive uppercase tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
}
