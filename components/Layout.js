import React, { useState } from 'react';
import { Menu, X, Bookmark, FolderOpen, Sun, Moon } from 'lucide-react';

const Layout = ({ children, saveMeeting, loadMeeting, toggleDarkMode, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Save Meeting', icon: Bookmark, onClick: saveMeeting },
    { name: 'Load Meeting', icon: FolderOpen, onClick: loadMeeting },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <h1 className="text-2xl font-bold gradient-text">Meeting Agenda Planner</h1>
            </div>
            <nav className="hidden md:flex space-x-4 items-center">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="btn btn-secondary flex items-center"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </button>
              ))}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 hover:scale-110"
              >
                {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
            </nav>
            <div className="md:hidden">
              <button
                type="button"
                className="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-800">
          <div className="pt-5 pb-6 px-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold gradient-text">Menu</h2>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="mt-6">
              <nav className="grid gap-y-8">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className="btn btn-secondary flex items-center"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-secondary flex items-center"
                >
                  {darkMode ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                  Toggle Theme
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;