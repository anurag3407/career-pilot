import { useState, useRef, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Collapsible({
    title,
    defaultOpen = false,
    children,
    icon,
    isOpen: controlledOpen,
    onOpenChange,
}) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const contentRef = useRef(null);
    const hasMeasuredRef = useRef(false);

    const [height, setHeight] = useState(0);

    const contentId = useId();
    const buttonId = useId();

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
            hasMeasuredRef.current = true;
        }
    }, [children, open]);

    const toggleOpen = () => {
        const nextOpen = !open;

        if (!isControlled) {
            setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    };

    return (
        <div className="border border-border rounded-2xl bg-card overflow-hidden">
            <button
                type="button"
                onClick={toggleOpen}
                aria-expanded={open}
                aria-controls={contentId}
                id={buttonId}
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
                id={contentId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!open}
                initial={false}
                animate={{
                    height: open ? height : 0,
                    opacity: open ? 1 : 0,
                }}
                transition={
                    hasMeasuredRef.current
                        ? {
                              duration: 0.25,
                              ease: "easeInOut",
                          }
                        : {
                              duration: 0,
                          }
                }
                className="overflow-hidden"
            >
                <div ref={contentRef} className="px-4 pb-4">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}