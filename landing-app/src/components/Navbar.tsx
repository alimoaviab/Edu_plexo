/**
 * Navbar.
 *
 * Same visual identity as before (transparent → frosted on scroll, mobile
 * menu animation preserved). The hash anchors stay in sync with the footer
 * (`#features` / `#platform` / `#security` / `#pricing`) and use the shared
 * smooth-scroll helper so links work from any route.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppIcon } from "shared/ui/AppIcon";
import { motion, AnimatePresence } from 'framer-motion';

import { LOGIN_URL } from '@/lib/config';
import { makeAnchorClickHandler } from '@/lib/scroll-to';
import { whatsappUrl, WhatsappMessages } from '@/lib/whatsapp';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_LINKS = [
  { label: 'Features', hash: '#features' },
  { label: 'Platform', hash: '#platform' },
  { label: 'Security', hash: '#security' },
  { label: 'Pricing', hash: '#pricing' },
  { label: 'Blog', to: '/blog' },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-lg shadow-sm border-b border-slate-200/60 dark:border-slate-850'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-md ring-1 ring-slate-200 dark:ring-slate-800 flex-shrink-0 group-hover:shadow-lg group-hover:ring-sky-300 transition-all">
            <img
              src="/logo.jpeg"
              alt="EduPlexo — AI School Management System Logo"
              className="w-full h-full object-cover"
              loading="eager"
              width="40"
              height="40"
            />
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            EduPlexo
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.hash ?? '#'}
                onClick={makeAnchorClickHandler(link.hash ?? '#', navigate)}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        {/* Auth CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <a
            href={LOGIN_URL}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2"
          >
            Log in
          </a>
          <a
            href={whatsappUrl(WhatsappMessages.bookDemo())}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white bg-slate-900 dark:bg-sky-500 dark:hover:bg-sky-400 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg px-5 py-2.5 rounded-full"
          >
            Book Demo
          </a>
        </div>

        {/* Mobile Menu Toggle & Theme */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <AppIcon name="X" className="w-6 h-6" /> : <AppIcon name="Menu" className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-1">
              {NAV_LINKS.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.hash ?? '#'}
                    onClick={makeAnchorClickHandler(link.hash ?? '#', navigate, () =>
                      setMobileMenuOpen(false),
                    )}
                    className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {link.label}
                  </a>
                ),
              )}
              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-3" />
              <a
                href={LOGIN_URL}
                className="text-base font-medium text-slate-700 dark:text-slate-200 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-center transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </a>
              <a
                href={whatsappUrl(WhatsappMessages.bookDemo())}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-white bg-sky-600 p-3 rounded-lg text-center shadow-md hover:shadow-lg hover:bg-sky-500 transition-all"
              >
                Book Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
