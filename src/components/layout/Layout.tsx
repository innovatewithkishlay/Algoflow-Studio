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
    <footer className="bg-gradient-to-tr from-indigo-50 via-indigo-100 to-purple-50 border-t border-indigo-100 py-6 mt-auto">
  <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-2">
      <span className="inline-block font-bold text-indigo-700 text-lg tracking-tight">DSA Visualizer</span>
      <span className="text-indigo-400 text-xl select-none">•</span>
      <span className="text-sm text-indigo-500">Learn. Visualize. Master.</span>
    </div>
    <div className="flex items-center gap-4">
      {/* i will update it later */}
    </div>
    <p className="text-xs text-indigo-400 tracking-wide">
      © {new Date().getFullYear()} DSA Visualizer. All rights reserved.
    </p>
  </div>
</footer>


    </div>
  );
};

export default Layout;
