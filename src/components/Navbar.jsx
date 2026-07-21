import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PlusCircle, UserCheck, LogOut, Lock } from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenUploadOcr, isLoggedIn, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');

  // Robust Scroll Spy for 100% active tab accuracy
  useEffect(() => {
    const sectionMap = isLoggedIn
      ? [
          { id: 'home', name: 'Home', hash: '#home' },
          { id: 'dashboard', name: 'Dashboard', hash: '#dashboard' },
          { id: 'features', name: 'Features', hash: '#features' },
          { id: 'ocr-vault', name: 'OCR Vault', hash: '#ocr-vault' },
          { id: 'hospitals', name: 'Nearby Hospitals', hash: '#hospitals' },
          { id: 'how-it-works', name: 'How It Works', hash: '#how-it-works' },
          { id: 'why-us', name: 'Why Us', hash: '#why-us' },
        ]
      : [
          { id: 'home', name: 'Home', hash: '#home' },
          { id: 'features', name: 'Features', hash: '#features' },
          { id: 'hospitals', name: 'Nearby Hospitals', hash: '#hospitals' },
          { id: 'how-it-works', name: 'How It Works', hash: '#how-it-works' },
          { id: 'why-us', name: 'Why Us', hash: '#why-us' },
        ];

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      let currentSection = sectionMap[0]; // fallback to home
      
      // Iterate backwards to find the deepest section currently in view
      for (let i = sectionMap.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionMap[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the element is above or near the top of the viewport (with 300px navbar offset buffer)
          if (rect.top <= 300) {
            currentSection = sectionMap[i];
            break;
          }
        }
      }

      if (currentSection) {
        setActiveNav(currentSection.name);
        if (window.location.hash !== currentSection.hash) {
          window.history.replaceState(null, '', currentSection.hash);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoggedIn]);

  const navLinks = isLoggedIn
    ? [
        { name: 'Home', href: '#home' },
        { name: 'Dashboard', href: '#dashboard' },
        { name: 'Features', href: '#features' },
        { name: 'OCR Vault', href: '#ocr-vault' },
        { name: 'Nearby Hospitals', href: '#hospitals' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Why Us', href: '#why-us' },
      ]
    : [
        { name: 'Home', href: '#home' },
        { name: 'Features', href: '#features' },
        { name: 'Nearby Hospitals', href: '#hospitals' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Why Us', href: '#why-us' },
      ];

  const handleNavClick = (linkName, href) => {
    setActiveNav(linkName);
    window.history.replaceState(null, '', href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={() => handleNavClick('Home', '#home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-0.5 shadow-md group-hover:shadow-lg transition-all">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5z" opacity="0.2" />
                  <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-5.45 8-12V5l-8-3zm1 14h-2v-3H8v-2h3V8h2v3h3v2h-3v3z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none font-sans">
                MediSpace <span className="text-blue-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                Upload. Analyze. Understand.
              </span>
            </div>
          </a>

          {/* Center Navigation Links with Active Highlight Bar */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeNav === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.name, link.href)}
                  className={`relative py-1 text-sm font-semibold transition-colors ${
                    isActive ? 'text-blue-600 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-full shadow-xs"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenUploadOcr}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Upload Record</span>
                </button>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>{user?.name || 'Authorized User'}</span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 pt-4 pb-6 mt-3 space-y-3"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = activeNav === link.name;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      handleNavClick(link.name, link.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenUploadOcr();
                    }}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-center shadow-md flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Upload Record</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-center"
                  >
                    Log Out ({user?.name})
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-center shadow-md"
                >
                  Get Started
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
