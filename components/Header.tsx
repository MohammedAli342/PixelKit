
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <header className="relative z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo - Ensure it stays above the menu overlay */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-white z-50 relative">
          <Logo className="h-8 w-8" />
          <span>PixelKit</span>
        </Link>
        
        <div className="flex items-center gap-4 z-50 relative">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/faq" className="text-slate-300 hover:text-white transition-colors">{t('header.faq')}</Link>
          </div>
          
          <LanguageSelector />
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan rounded-lg"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/95 backdrop-blur-md z-40 transition-all duration-300 ease-in-out md:hidden flex flex-col justify-center items-center ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
         <nav className="flex flex-col items-center space-y-8 text-xl font-bold p-8 text-center">
            <Link to="/" className="text-white hover:text-brand-cyan transition-colors transform hover:scale-105 duration-200">{t('home.hero.title')}</Link>
            <Link to="/image-converter" className="text-slate-300 hover:text-brand-cyan transition-colors">{t('tools.converter.name')}</Link>
            <Link to="/image-compressor" className="text-slate-300 hover:text-brand-cyan transition-colors">{t('tools.compressor.name')}</Link>
            <Link to="/pdf-to-jpg" className="text-slate-300 hover:text-brand-cyan transition-colors">{t('tools.pdfToJpg.name')}</Link>
            <div className="w-16 h-1 bg-white/10 rounded-full my-4"></div>
            <Link to="/faq" className="text-slate-300 hover:text-white transition-colors">{t('header.faq')}</Link>
         </nav>
      </div>
    </header>
  );
};

export default Header;
