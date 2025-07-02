import React from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

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
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-zinc-900/80 backdrop-blur-lg shadow-md">
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand + Sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
          >
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 7h14M4 12h14M4 17h14" />
            </svg>
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold text-xl text-indigo-700 dark:text-indigo-300 tracking-tight"
          >
            <motion.svg
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              width={28}
              height={28}
              viewBox="0 0 28 28"
              fill="none"
            >
              <circle cx={14} cy={22} r={4} fill="#6366f1" />
              <circle cx={7} cy={8} r={3} fill="#a5b4fc" />
              <circle cx={21} cy={8} r={3} fill="#a5b4fc" />
              <circle cx={14} cy={14} r={3.5} fill="#818cf8" />
              <line x1={14} y1={18} x2={14} y2={14} stroke="#6366f1" strokeWidth={2} />
              <line x1={14} y1={14} x2={7} y2={8} stroke="#818cf8" strokeWidth={2} />
              <line x1={14} y1={14} x2={21} y2={8} stroke="#818cf8" strokeWidth={2} />
            </motion.svg>
            <span>DSA Visualizer</span>
          </Link>
        </div>

        {/* Nav Links */}
        <ul className="hidden lg:flex items-center gap-3">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="relative px-5 py-3 font-medium rounded-md text-base transition-colors duration-200 group"
                >
                  <motion.span
                    className={`z-10 relative ${
                      isActive
                        ? "text-indigo-700 dark:text-indigo-200"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {link.label}
                  </motion.span>

                  {/* Underline hover effect */}
                  {!isActive && (
                    <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-indigo-400 rounded-full group-hover:w-3/4 transition-all duration-300 transform -translate-x-1/2" />
                  )}

                  {/* Active underline animation */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-2 right-2 bottom-1 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Theme toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:scale-110 transition-all duration-200 shadow-sm"
          >
            {isDarkMode ? (
              <motion.svg
                key="sun"
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
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
                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
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
