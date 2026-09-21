import React from 'react';
import { IconSun, IconMoon } from './Icons';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="btn-icon"
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <IconSun width={18} height={18} /> : <IconMoon width={18} height={18} />}
    </button>
  );
}
