import React from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  onSidebarToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button
            className="navbar-toggler border-0 me-3 d-lg-none"
            type="button"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to="/" className="navbar-brand fw-bold fs-3 mb-0 text-decoration-none">
            <i className="bi bi-diagram-3 me-2"></i>
            DSA Visualizer
          </Link>
        </div>

        <div className="navbar-nav me-auto d-none d-lg-flex">
          {/* Data Structures Link */}
          <Link
            to="/data-structures"
            className={`nav-link ${isActive('/data-structures') ? 'active' : ''}`}>
            <i className="bi bi-collection me-1"></i>
            Data Structures
          </Link>

          {/* Algorithms Link */}
          <Link
            to="/algorithms"
            className={`nav-link ${isActive('/algorithms') ? 'active' : ''}`}>
            <i className="bi bi-gear me-1"></i>
            Algorithms
          </Link>

          {/* Time Complexity Link */}
          <li className="nav-item">
            <NavLink to="/time-complexity" className="nav-link">
              <i className="bi bi-hourglass-split me-1"></i>
              Time Complexity
            </NavLink>
          </li>
        </div>

        <div className="d-flex align-items-center">
          {/* Theme Toggle Button */}
          <button
            className="btn btn-outline-light btn-sm me-2"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
            <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`}></i>
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/d02ev"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light btn-sm"
            title="View on GitHub">
            <i className="bi bi-github"></i>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;