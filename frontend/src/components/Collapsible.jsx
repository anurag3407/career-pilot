import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function Collapsible({
    title,
    defaultOpen = false,
    children,
    icon,
    isOpen: controlledOpen,
}) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        }
    }, [children, open]);

    const toggleOpen = () => {
        if (!isControlled) {
            setInternalOpen((prev) => !prev);
        }
    };

    return (
        <div className="border border-border rounded-2xl bg-card overflow-hidden">
            <button
                type="button"
                onClick={toggleOpen}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-muted/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="text-primary flex-shrink-0">
                            {icon}
                        </div>
                    )}

                    <h3 className="font-semibold text-foreground">
                        {title}
                    </h3>
                </div>

                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
            </button>

            <motion.div
                initial={false}
                animate={{
                    height: open ? height : 0,
                    opacity: open ? 1 : 0,
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                }}
                className="overflow-hidden"
            >
                <div
                    ref={contentRef}
                    className={cn(
                        "px-4 pb-4 text-sm text-muted-foreground"
                    )}
                >
                    {children}
                </div>
            </motion.div>
        </div>
    );
}