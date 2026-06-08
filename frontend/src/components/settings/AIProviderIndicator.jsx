import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Settings, Cpu } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAIConfigStore, PROVIDER_META } from "../../stores/useAIConfigStore";

export default function AIProviderIndicator({ open, animate }) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const activeProvider = useAIConfigStore((s) => s.activeProvider);
  const providers = useAIConfigStore((s) => s.providers);
  const setActiveProvider = useAIConfigStore((s) => s.setActiveProvider);
  const getConfiguredProviders = useAIConfigStore((s) => s.getConfiguredProviders);

  const configuredProviders = getConfiguredProviders();
  const activeMeta = activeProvider ? PROVIDER_META[activeProvider] : null;

  const icon = activeMeta?.icon ?? "🤖";
  const label = activeMeta?.name ?? "Server AI";
  const activeModel =
    activeProvider && providers[activeProvider]?.model
      ? providers[activeProvider].model
      : activeMeta?.defaultModel ?? "";

  // Color dot based on provider status
  const dotColor = activeProvider ? "bg-emerald-400" : "bg-zinc-400";

  // Close popover on outside click
  useEffect(() => {
    if (!showPopover) return;

    const handleClick = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPopover]);

  const handleSelect = (provider) => {
    setActiveProvider(provider);
    setShowPopover(false);
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={() => setShowPopover((prev) => !prev)}
        className={cn(
          "flex items-center gap-3 w-full py-3 px-4 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer font-bold",
          !open && animate && "justify-center"
        )}
      >
        {/* Icon + status dot */}
        <span className="relative shrink-0 text-lg leading-none">
          {icon}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-card",
              dotColor
            )}
          />
        </span>

        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          transition={{ duration: 0.2 }}
          className="text-sm font-bold whitespace-pre"
        >
          {label}
        </motion.span>

        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          transition={{ duration: 0.2 }}
          className="ml-auto"
        >
          <ChevronUp
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              showPopover ? "rotate-0" : "rotate-180"
            )}
          />
        </motion.span>
      </button>

      {/* Floating popover */}
      <AnimatePresence>
        {showPopover && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Heading */}
            <div className="px-4 pt-3 pb-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                AI Provider
              </p>
            </div>

            {/* Provider list */}
            <div className="px-2 pb-2 flex flex-col gap-0.5">
              {/* Server Default option */}
              <button
                onClick={() => handleSelect("")}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer",
                  !activeProvider
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Cpu className="w-4 h-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">Server Default</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Uses backend AI configuration
                  </p>
                </div>
                {!activeProvider && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                )}
              </button>

              {/* Configured providers */}
              {configuredProviders.map((key) => {
                const meta = PROVIDER_META[key];
                if (!meta) return null;

                const model =
                  providers[key]?.model || meta.defaultModel || "";
                const isActive = activeProvider === key;

                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="text-base shrink-0 leading-none">
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {meta.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {model}
                      </p>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider + Manage Keys link */}
            <div className="border-t border-border px-2 py-2">
              <button
                onClick={() => {
                  setShowPopover(false);
                  navigate("/settings");
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Manage Keys →</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
