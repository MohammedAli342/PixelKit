
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-8 text-center text-slate-400">
        <p className="mb-4">{t('footer.copyright')}</p>
        <div className="flex justify-center space-x-6">
          <Link to="/privacy-policy" className="hover:text-brand-cyan transition-colors">{t('footer.privacy')}</Link>
          <Link to="/terms-of-use" className="hover:text-brand-cyan transition-colors">{t('footer.terms')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
