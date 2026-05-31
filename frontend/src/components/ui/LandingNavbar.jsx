import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-background/70 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <img src="/speed.png" alt="logo" className="w-8 h-8 object-contain" />
            careerpilot
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Templates', 'Portfolio', 'Jobs', 'Resume'].map((item) => (
              <Link 
                key={item} 
                to={`/${item.toLowerCase()}`}
                className="text-foreground hover:text-foreground/80 transition-colors font-medium cursor-pointer"
              >
                {item}
              </Link>
            ))}
            <Link to="/login" className="text-foreground hover:text-foreground/80 transition-colors font-medium cursor-pointer">Login</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 left-4 right-4 bg-background/95 backdrop-blur-md rounded-2xl shadow-xl z-50 md:hidden p-4 transition-all border border-border/60">
          <div className="flex flex-col space-y-4 text-center">
            {['Templates', 'Portfolio', 'Jobs', 'Resume', 'Login'].map((item) => (
              <Link 
                key={item} 
                to={`/${item.toLowerCase()}`}
                className="text-foreground font-medium py-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
