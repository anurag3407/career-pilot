/**
 * Netflix Browse Portfolio Template
 * ───────────────────────────────────
 * A complete single-page portfolio styled after the Netflix Browse UI:
 * - Dark background (#141414), Netflix red (#E50914) accents
 * - Horizontal carousels for Projects, Experience, and Testimonials
 * - Hover-expand cards with preview details
 * - Full-screen cinematic hero banner
 * - Framer Motion animations throughout
 *
 * Data: imported from src/data/dummy_data.json
 * Sub-components: Hero, About, Skills, Projects, Experience, Testimonials, Contact
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import data from "../../../../data/dummy_data.json";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Experience from "./Experience";
import Testimonials from "./Testimonials";
import Contact from "./Contact";

/* ── Navigation links ── */
const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

/* ── Netflix-style sticky Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#141414] shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
          : "bg-gradient-to-b from-[#141414]/90 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <a
          href="#hero"
          className="text-[#E50914] font-black text-2xl tracking-tighter select-none"
          aria-label="Home"
        >
          N
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="text-[#e5e5e5] text-sm font-medium hover:text-white transition-colors relative group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#E50914] group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#1f1f1f] border-t border-white/5 px-6 py-4 space-y-3"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-[#e5e5e5] text-sm font-medium py-1 hover:text-[#E50914] transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ── Section divider ── */
function Divider() {
  return (
    <div className="flex items-center gap-4 px-4 md:px-12">
      <div className="h-px flex-1 bg-white/5" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}

/* ── Footer ── */
function Footer({ name }) {
  return (
    <footer className="py-8 px-4 md:px-12 border-t border-white/5 mt-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[#E50914] font-black text-xl">N</span>
        <p className="text-[#525252] text-xs text-center">
          © {new Date().getFullYear()} {name}. Built with React + Tailwind CSS on Career Pilot.
        </p>
        <a
          href="#hero"
          className="text-[#737373] text-xs hover:text-[#E50914] transition-colors"
        >
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function NetflixBrowse({ isPreview = false }) {
  return (
    <div
      id="netflix-portfolio"
      className="bg-[#141414] min-h-screen text-white font-sans antialiased"
      style={{ fontFamily: "'Inter', 'Netflix Sans', sans-serif" }}
    >
      {/* Sticky Netflix-style navbar */}
      {!isPreview && <Navbar />}

      {/* ── Hero ── */}
      <Hero personal={data.personal} stats={data.stats} />

      {/* ── About ── */}
      <Divider />
      <About personal={data.personal} socials={data.socials} />

      {/* ── Skills ── */}
      <Divider />
      <Skills skills={data.skills} />

      {/* ── Projects carousel ── */}
      <Divider />
      <Projects projects={data.projects} />

      {/* ── Experience carousel ── */}
      <Divider />
      <Experience experience={data.experience} />

      {/* ── Testimonials carousel ── */}
      <Divider />
      <Testimonials testimonials={data.testimonials} />

      {/* ── Contact ── */}
      <Divider />
      <Contact personal={data.personal} socials={data.socials} />

      {/* ── Footer ── */}
      <Footer name={data.personal.name} />
    </div>
  );
}
