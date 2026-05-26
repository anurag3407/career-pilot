import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Briefcase,
  Search,
  Mic,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FAB({ scrollContainerRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = 0;

    const container = scrollContainerRef?.current;

    const handleScroll = () => {
      if (!container) return;

      const currentScrollY = container.scrollTop;

      setIsVisible(
        currentScrollY < lastScrollY || currentScrollY < 100
      );

      lastScrollY = currentScrollY;
    };

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    container?.addEventListener("scroll", throttledScroll);

    return () => {
      container?.removeEventListener(
        "scroll",
        throttledScroll
      );
    };
  }, [scrollContainerRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  const actions = [
    {
      label: "Create Portfolio",
      icon: <FileText size={18} />,
      action: () => navigate("/profile"),
    },
    {
      label: "Upload Resume",
      icon: <Briefcase size={18} />,
      action: () => navigate("/upload"),
    },
    {
      label: "Search Jobs",
      icon: <Search size={18} />,
      action: () => navigate("/jobs"),
    },
    {
      label: "Start Interview",
      icon: <Mic size={18} />,
      action: () => navigate("/interview-prep"),
    },
  ];

  return (
    <motion.div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isVisible && (
          <div className="flex flex-col-reverse items-end gap-3">
            <motion.button
              type="button"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={
                isOpen ? "Close quick actions" : "Open quick actions"
              }
              aria-expanded={isOpen}
              className="p-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:scale-110 transition-transform glow"
            >
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
              >
                <Plus size={24} />
              </motion.div>
            </motion.button>

            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 mb-2"
                role="menu"
              >
                {actions.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    role="menuitem"
                    tabIndex={0}
                    aria-label={item.label}
                    className="flex items-center gap-3 px-4 py-2 glass border-border rounded-full shadow-lg hover:bg-primary/10 hover:text-primary transition-all-300 hover:-translate-y-1 whitespace-nowrap"
                  >
                    {item.icon}
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}