import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, Clock, CornerDownLeft } from 'lucide-react';
import { getAllTools, ACCOUNT_LINKS } from '../constants/navigation';

const actions = [...getAllTools(), ...ACCOUNT_LINKS.map((l) => ({ ...l, group: 'Account' }))].map(
  (item) => ({
    id: item.to,
    title: item.label,
    description: item.desc,
    icon: item.icon,
    path: item.to,
    group: item.group,
  })
);

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

      try {
        const saved = JSON.parse(localStorage.getItem('recentCommands')) || [];
        setRecentActions(saved.filter((a) => actions.some((action) => action.id === a.id)));
      } catch {
        setRecentActions([]);
      }
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
    const q = query.trim().toLowerCase();
    if (!q) return actions;

    return actions.filter(
      (action) =>
        action.title.toLowerCase().includes(q) ||
        action.description.toLowerCase().includes(q) ||
        action.group.toLowerCase().includes(q)
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
    return () => window.removeEventListener('keydown', handleKeyDown);
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

    localStorage.setItem('recentCommands', JSON.stringify(recentWithoutIcons));
    setRecentActions(recentWithoutIcons);
    setIsOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  let lastGroup = null;

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-foreground/40 px-4 pt-24 backdrop-blur-sm"
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-label="Command palette"
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search size={18} className="text-primary" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools, pages and actions…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>

        {!query && recentActions.length > 0 && (
          <div className="border-b border-border px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Clock size={14} />
              Recent
            </div>
            <div className="space-y-1">
              {recentActions.map((action) => {
                const matchedAction = actions.find((a) => a.id === action.id);
                const Icon = matchedAction?.icon || Briefcase;

                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(matchedAction || action)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-muted"
                  >
                    <Icon size={18} className="text-primary" />
                    <div>
                      <p className="text-sm text-foreground">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
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
              const showGroupHeader = action.group !== lastGroup;
              lastGroup = action.group;

              return (
                <React.Fragment key={action.id}>
                  {showGroupHeader && (
                    <p className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 first:pt-1">
                      {action.group}
                    </p>
                  )}
                  <button
                    onClick={() => handleSelect(action)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-150 ${
                      selectedIndex === index
                        ? 'bg-primary/10 text-foreground ring-1 ring-primary/25'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon size={18} className="shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{action.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    {selectedIndex === index && (
                      <CornerDownLeft size={14} className="shrink-0 text-muted-foreground" />
                    )}
                  </button>
                </React.Fragment>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No matching tools found.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px]">⌘</kbd>
            <span>+</span>
            <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px]">K</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;