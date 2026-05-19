import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Briefcase, Search, Mic } from "lucide-react";

export default function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const actions = [
    { label: "Create Portfolio", icon: <FileText size={18} /> },
    { label: "Upload Resume", icon: <Briefcase size={18} /> },
    { label: "Search Jobs", icon: <Search size={18} /> },
    { label: "Start Interview", icon: <Mic size={18} /> },
  ];

  useEffect(() => {
    let lastScrollY = 0;
    const mainContainer = document.querySelector("main");

    const handleScroll = () => {
      if (!mainContainer) return;
      const currentScrollY = mainContainer.scrollTop;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };

    mainContainer?.addEventListener("scroll", handleScroll);
    return () => mainContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isVisible && (
          <div className="flex flex-col-reverse items-end gap-3">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:scale-105 transition-transform"
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
              >
                {actions.map((action, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-3 px-4 py-2 bg-background border border-border rounded-full shadow-md hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    {action.icon}
                    <span className="text-sm font-medium">{action.label}</span>
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