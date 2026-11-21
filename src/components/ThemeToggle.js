import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <select 
      value={theme} 
      onChange={(e) => setTheme(e.target.value)}
      className="p-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    >
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
      <option value="system">💻 System</option>
    </select>
  );
};
