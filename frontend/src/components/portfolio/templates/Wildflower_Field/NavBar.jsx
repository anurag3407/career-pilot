// NavBar.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Daisy } from "./WildflowerSVGs";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function NavBar({ name }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      >
        <div
          className="max-w-5xl mx-auto rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300"
          style={{
            background: scrolled ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.55)",
            backdropFilter: "blur(16px)",
            border: scrolled ? "1px solid rgba(253,186,216,0.5)" : "1px solid rgba(253,186,216,0.25)",
            boxShadow: scrolled ? "0 8px 32px rgba(190,24,93,0.08)" : "none",
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="flex items-center gap-2 no-underline"
            aria-label="Back to top"
          >
            <motion.div
              animate={{ rotate: [0, 10, -7, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Daisy size={28} color="#fda4af" centerColor="#fde68a" />
            </motion.div>
            <span
              className="font-serif text-base font-bold hidden sm:block"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: "linear-gradient(135deg, #be185d, #065f46)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {name.split(" ")[0]}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => {
              const id = href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="relative px-3 py-1.5 rounded-xl text-sm transition-colors duration-200"
                  style={{
                    color: isActive ? "#be185d" : "#6b7280",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: "none",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: "rgba(252,231,243,0.8)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </a>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              background: "rgba(252,231,243,0.6)",
              border: "1px solid rgba(253,186,216,0.4)",
              color: "#be185d",
            }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-24 left-4 right-4 z-40 rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(253,186,216,0.45)",
              boxShadow: "0 16px 40px rgba(190,24,93,0.1)",
            }}
          >
            <nav aria-label="Mobile navigation">
              {navLinks.map(({ href, label }, i) => {
                const id = href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 last:mb-0"
                    style={{
                      background: isActive ? "rgba(252,231,243,0.8)" : "transparent",
                      color: isActive ? "#be185d" : "#6b7280",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.05rem",
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: "none",
                    }}
                  >
                    {isActive && (
                      <span style={{ color: "#fda4af" }}>✿</span>
                    )}
                    {label}
                  </motion.a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
