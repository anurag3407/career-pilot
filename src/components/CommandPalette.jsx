import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Code,
  Briefcase,
  Sparkles,
  FileText,
  TrendingUp,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

const actions = [
  {
    id: 1,
    title: 'Create Portfolio',
    description: 'Build and manage your portfolio',
    icon: Briefcase,
    path: '/profile',
  },
  {
    id: 2,
    title: 'Connect GitHub',
    description: 'Link your GitHub account',
    icon: Code,
    path: '/profile',
  },
  {
    id: 3,
    title: 'Analyze Repository',
    description: 'Analyze repository insights',
    icon: Code,
    path: '/profile',
  },
  {
    id: 4,
    title: 'Generate README Assets',
    description: 'Create README enhancements',
    icon: FileText,
    path: '/profile',
  },
  {
    id: 5,
    title: 'Skill Gap Analysis',
    description: 'Analyze missing skills',
    icon: Sparkles,
    path: '/dashboard',
  },
  {
    id: 6,
    title: 'Career Trajectory',
    description: 'Explore career growth insights',
    icon: TrendingUp,
    path: '/dashboard',
  },
  {
    id: 7,
    title: 'Dashboard',
    description: 'Go to dashboard',
    icon: Briefcase,
    path: '/dashboard',
  },
  {
    id: 8,
    title: 'Jobs',
    description: 'Browse jobs',
    icon: Briefcase,
    path: '/jobs',
  },
  {
    id: 9,
    title: 'Profile',
    description: 'Open your profile',
    icon: Briefcase,
    path: '/profile',
  },
];

const CommandPalette = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentActions, setRecentActions] = useState([]);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      const saved =
        JSON.parse(localStorage.getItem('recentCommands')) || [];

      setRecentActions(saved);
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setSelectedIndex(0);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const filteredActions = useMemo(() => {
    if (!query.trim()) {
      return actions;
    }

    return actions.filter((action) =>
      action.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();

        setSelectedIndex((prev) =>
          prev < filteredActions.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();

        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredActions.length - 1
        );
      }

      if (e.key === 'Enter') {
        e.preventDefault();

        const selected = filteredActions[selectedIndex];

        if (selected) {
          handleSelect(selected);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () =>
      window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredActions]);

  const handleSelect = (action) => {
    navigate(action.path);

    const recentWithoutIcons = [
      {
        id: action.id,
        title: action.title,
        description: action.description,
        path: action.path,
      },
      ...recentActions.filter((a) => a.id !== action.id),
    ].slice(0, 5);

    localStorage.setItem(
      'recentCommands',
      JSON.stringify(recentWithoutIcons)
    );

    setRecentActions(recentWithoutIcons);

    toast.success(`Opening ${action.title}`);

    setIsOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center px-4 pt-24"
    >
      <div
        ref={containerRef}
        className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b1120]/95 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search size={18} className="text-cyan-400" />

          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent outline-none text-white placeholder:text-gray-500 text-sm"
          />

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <kbd className="rounded bg-white/10 px-2 py-1">
              ESC
            </kbd>
          </div>
        </div>

        {!query && recentActions.length > 0 && (
          <div className="border-b border-white/10 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <Clock size={14} />
              Recent
            </div>

            <div className="space-y-1">
              {recentActions.map((action) => {
                const matchedAction = actions.find(
                  (a) => a.id === action.id
                );

                const Icon =
                  matchedAction?.icon || Briefcase;

                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(action)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5 transition"
                  >
                    <div className="text-cyan-400">
                      <Icon size={18} />
                    </div>

                    <div>
                      <p className="text-sm text-white">
                        {action.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {action.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="max-h-[420px] overflow-y-auto p-3">
          {filteredActions.length > 0 ? (
            filteredActions.map((action, index) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.id}
                  onClick={() => handleSelect(action)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
                    selectedIndex === index
                      ? 'bg-cyan-500/10 border border-cyan-500/20'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="text-cyan-400">
                    <Icon size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {action.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">
                No matching commands found.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="rounded bg-white/10 px-2 py-1">
              Ctrl
            </kbd>

            <span>+</span>

            <kbd className="rounded bg-white/10 px-2 py-1">
              K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
