import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleSidebarToggle = () => {
    // This is now handled by the navbar dropdowns on desktop
    // On mobile, we could implement a mobile menu if needed
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar onSidebarToggle={handleSidebarToggle} />

      {/* Main Content */}
      <main className="flex-grow-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <div className="container">
          <p className="mb-0">
            Made with ❤️ by{' '}
            <a
              href="https://github.com/d02ev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-decoration-none fw-bold"
              style={{ textDecoration: 'underline' }}
            >
              d02ev
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;