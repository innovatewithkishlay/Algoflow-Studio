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
 <footer className="bg-white border-t border-zinc-200 py-8 mt-auto">
  <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start md:items-center">
    {/* About */}
    <div className="flex-1 mb-6 md:mb-0">
      <span className="font-extrabold text-indigo-700 text-lg tracking-tight">AlgoFlow Studio</span>
      <p className="text-zinc-600 mt-2 text-sm max-w-xs">
        An interactive platform to master Data Structures & Algorithms through stepwise visualizations and modern learning tools.
      </p>
      <p className="text-xs text-zinc-400 mt-2">
        Made with <span className="text-pink-500">♥</span> for learners everywhere.
      </p>
    </div>
    {/* Quick Links */}
    <div className="flex-1 flex flex-col gap-2 mb-6 md:mb-0">
      <span className="font-semibold text-zinc-800 mb-1">Quick Links</span>
      <a href="/data-structures" className="text-zinc-600 hover:text-indigo-700 text-sm transition">Data Structures</a>
      <a href="/algorithms" className="text-zinc-600 hover:text-indigo-700 text-sm transition">Algorithms</a>
      <a href="/time-complexity" className="text-zinc-600 hover:text-indigo-700 text-sm transition">Time Complexity</a>
    </div>
    {/* Contact & Social */}
    <div className="flex-1 flex flex-col gap-2 items-start">
      <span className="font-semibold text-zinc-800 mb-1">Contact</span>
      <a href="mailto:hello@dsavisualizer.com" className="text-zinc-600 hover:text-indigo-700 text-sm transition">kishlay141@gmail.com</a>
      <div className="flex gap-4 mt-2">
        <a href="https://github.com/innovatewithkishlay" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-indigo-700 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.07 1.533 1.032 1.533 1.032.892 1.53 2.341 1.088 2.91.832.092-.646.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.273.098-2.654 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.381.202 2.4.1 2.654.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.36.31.682.921.682 1.857 0 1.34-.012 2.42-.012 2.75 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" clipRule="evenodd" /></svg>
        </a>
        <a href="https://twitter.com/kishlay_012" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-indigo-700 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.155 11.675-11.495 0-.175 0-.349-.012-.522A8.18 8.18 0 0022 5.92a8.27 8.27 0 01-2.357.637 4.07 4.07 0 001.804-2.23 8.19 8.19 0 01-2.605.981 4.1 4.1 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.07 4.07 0 001.27 5.482A4.07 4.07 0 012 9.713v.051a4.1 4.1 0 003.292 4.018 4.1 4.1 0 01-1.852.07 4.1 4.1 0 003.827 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
        </a>
        <a href="https://linkedin.com/in/kishlay1" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-indigo-700 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
        </a>
      </div>
    </div>
  </div>
  <div className="mt-8 text-center text-xs text-zinc-400">
    &copy; {new Date().getFullYear()} AlgoFlow Studio &mdash; Empowering the next generation of problem solvers.
  </div>
</footer>



    </div>
  );
};

export default Layout;
