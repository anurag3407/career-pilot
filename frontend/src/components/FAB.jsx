import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Briefcase, Search, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FAB({ scrollContainerRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const actions = [
    {
      label: "Create Portfolio",
      icon: <FileText size={18} />,
      onClick: () => navigate("/portfolio"),
    },
    {
      label: "Upload Resume",
      icon: <Briefcase size={18} />,
      onClick: () => navigate("/upload"),
    },
    {
      label: "Search Jobs",
      icon: <Search size={18} />,
      onClick: () => navigate("/jobs"),
    },
    {
      label: "Start Interview",
      icon: <Mic size={18} />,
      onClick: () => navigate("/interview"),
    },
  ];

  useEffect(() => {
    let lastScrollY = 0;
    const mainContainer = scrollContainerRef?.current;

    const handleScroll = () => {
      if (!mainContainer) return;

      const currentScrollY = mainContainer.scrollTop;

      setIsVisible(
        currentScrollY < lastScrollY || currentScrollY < 100
      );

      lastScrollY = currentScrollY;
    };

    mainContainer?.addEventListener("scroll", handleScroll);

    return () => {
      mainContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  // Close menu when FAB becomes hidden
  useEffect(() => {
    if (!isVisible && isOpen) {
      setIsOpen(false);
    }
  }, [isVisible, isOpen]);

  // Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
              <motion.div animate={{ rotate: isOpen ? 45 : 0 }}>
                <Plus size={24} />
              </motion.div>
            </motion.button>

            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 mb-2"
                role="menu"
                aria-label="Quick actions"
              >
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    role="menuitem"
                    tabIndex={0}
                    aria-label={action.label}
                    onClick={() => action.onClick?.()}
                    className="flex items-center gap-3 px-4 py-2 glass border-border rounded-full shadow-lg hover:bg-primary/10 hover:text-primary transition-all-300 hover:-translate-y-1 whitespace-nowrap"
                  >
                    {action.icon}
                    <span className="text-sm font-medium">
                      {action.label}
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