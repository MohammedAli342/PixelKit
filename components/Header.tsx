
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';

const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="relative z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-white">
          <Logo className="h-8 w-8" />
          <span>PixelKit</span>
        </Link>
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/faq" className="text-slate-300 hover:text-white transition-colors">{t('header.faq')}</Link>
          </div>
          <LanguageSelector />
        </div>
      </nav>
    </header>
  );
};

export default Header;
