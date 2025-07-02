import React from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onSidebarToggle: () => void;
}

const navLinks = [
  { to: "/data-structures", label: "Data Structures" },
  { to: "/algorithms", label: "Algorithms" },
  { to: "/time-complexity", label: "Time Complexity" },
];

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg shadow-md transition">
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {/* Sidebar toggle for mobile */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            onClick={onSidebarToggle}
            aria-label="Open sidebar"
          >
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} className="text-indigo-600 dark:text-indigo-300">
              <path strokeLinecap="round" d="M4 7h14M4 12h14M4 17h14" />
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-indigo-700 dark:text-indigo-300">
            {/* Custom SVG brand */}
            <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
              <circle cx={14} cy={22} r={4} fill="#6366f1" />
              <circle cx={7} cy={8} r={3} fill="#a5b4fc" />
              <circle cx={21} cy={8} r={3} fill="#a5b4fc" />
              <circle cx={14} cy={14} r={3.5} fill="#818cf8" />
              <line x1={14} y1={18} x2={14} y2={14} stroke="#6366f1" strokeWidth={2} />
              <line x1={14} y1={14} x2={7} y2={8} stroke="#818cf8" strokeWidth={2} />
              <line x1={14} y1={14} x2={21} y2={8} stroke="#818cf8" strokeWidth={2} />
            </svg>
            <span>DSA Visualizer</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <ul className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={`
                    relative px-4 py-2 rounded-lg font-medium text-base transition
                    ${isActive
                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 shadow-sm"
                      : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"}
                  `}
                  style={{ transition: "background 0.18s, color 0.18s" }}
                >
                  <span>{link.label}</span>
                  {/* Animated active background (optional) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-bg"
                        className="absolute inset-0 rounded-lg z-[-1] bg-indigo-100 dark:bg-indigo-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                      />
                    )}
                  </AnimatePresence>
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Right: Theme Toggle & GitHub */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          >
            {isDarkMode ? (
              <motion.svg
                key="sun"
                initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                width={20}
                height={20}
                fill="none"
                viewBox="0 0 24 24"
                className="text-yellow-400"
              >
                <circle cx={12} cy={12} r={5} stroke="currentColor" strokeWidth={2} />
                <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42" />
              </motion.svg>
            ) : (
              <motion.svg
                key="moon"
                initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                width={20}
                height={20}
                fill="none"
                viewBox="0 0 24 24"
                className="text-indigo-500"
              >
                <path
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
