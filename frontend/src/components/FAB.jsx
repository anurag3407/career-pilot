import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Briefcase, Search, Mic } from "lucide-react";
import { useSidebar } from "./ui/Sidebar";

export default function FAB({ scrollContainerRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { open: sidebarOpen } = useSidebar();
  const navigate = useNavigate();

  const actions = [
    {
      label: "Create Portfolio",
      icon: <FileText size={18} />,
      onClick: () => navigate("/templates"),
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
      onClick: () => navigate("/interview-prep"),
    },
  ];

  useEffect(() => {
    let lastScrollY = 0;
    const mainContainer = scrollContainerRef?.current;

    const handleScroll = () => {
      if (!mainContainer) return;

      const currentScrollY = mainContainer.scrollTop;
      
      // Show on scroll up or if near top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        // Hide on scroll down
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    mainContainer?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mainContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  // Close menu when FAB becomes hidden or sidebar opens on mobile
  useEffect(() => {
    if ((!isVisible || sidebarOpen) && isOpen) {
      setIsOpen(false);
    }
  }, [isVisible, isOpen, sidebarOpen]);

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

  // Requirement: Do NOT show on mobile if sidebar is visible
  // We use a combination of sidebarOpen state and CSS media queries
  const isHiddenOnMobile = sidebarOpen;

  return (
    <div className={`fixed bottom-6 right-6 z-[60] ${isHiddenOnMobile ? 'hidden md:block' : 'block'}`}>
      <AnimatePresence>
        {isVisible && (
          <div className="flex flex-col-reverse items-end gap-3">
            <motion.button
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
              aria-expanded={isOpen}
              className="p-4 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <motion.div 
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Plus size={24} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3 mb-2 items-end"
                  role="menu"
                  aria-label="Quick actions"
                >
                  {actions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        action.onClick?.();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-xl shadow-lg hover:bg-muted transition-all whitespace-nowrap group group-hover:border-primary/50"
                    >
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {action.label}
                      </span>
                      <div className="p-1.5 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {action.icon}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}