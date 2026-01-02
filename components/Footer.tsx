
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-white/10 mt-20 bg-slate-900/50">
      <div className="container mx-auto px-4 py-12 text-center text-slate-400">
        <div className="flex flex-col items-center mb-6">
           <p className="text-sm md:text-base">{t('footer.copyright')}</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm font-medium">
          <Link to="/privacy-policy" className="hover:text-brand-cyan transition-colors py-2 md:py-0">{t('footer.privacy')}</Link>
          <span className="hidden md:inline text-slate-600">•</span>
          <Link to="/terms-of-use" className="hover:text-brand-cyan transition-colors py-2 md:py-0">{t('footer.terms')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
