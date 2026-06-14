import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import AvatarDropdown from './AvatarDropdown';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/resume', label: 'Resume' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="w-full px-4 py-3 flex items-center justify-between border-b bg-background">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-primary">
        CareerPilot
      </Link>

      {/* Desktop nav links — visible from lg (1024px) */}
      <div className="hidden lg:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Avatar + theme toggle — visible from lg (1024px), aligned with nav links */}
      <div className="hidden lg:flex items-center gap-3">
        <ThemeToggle />
        {user && <AvatarDropdown user={user} />}
      </div>

      {/* Hamburger button — shown below lg (below 1024px) */}
      <button
        className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-primary focus:outline-none"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background border-b shadow-md z-50 flex flex-col px-4 py-4 gap-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2 border-t">
            <ThemeToggle />
            {user && <AvatarDropdown user={user} />}
          </div>
        </div>
      )}
    </nav>
  );
}
