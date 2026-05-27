import { useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      onToggle(false);
    }
  }, [onToggle]);

  const handleToggle = () => {
    const newMode = !isDarkMode;
    onToggle(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <div className="theme-toggle">
      <button
        onClick={handleToggle}
        className="theme-button"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <span className="theme-icon">☀️</span>
        ) : (
          <span className="theme-icon">🌙</span>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
