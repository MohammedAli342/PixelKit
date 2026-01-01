
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface PageHeroProps {
  title: React.ReactNode;
  subtitle: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle }) => {
  const { t } = useTranslation();
  return (
    <div className="py-16 text-center relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="absolute top-0 left-4 md:left-0">
             <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <span className="hidden md:inline font-medium">{t('common.back')}</span>
            </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.3)'}}>{title}</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </div>
  );
};

export default PageHero;
