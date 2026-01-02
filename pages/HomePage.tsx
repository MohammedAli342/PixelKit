
import React from 'react';
import { Tool } from '../types';
import ToolCard from '../components/ToolCard';
import Seo from '../components/Seo';
import { Logo } from '../components/Logo';
import { Icons } from '../components/Icons';
import { useTranslation } from '../hooks/useTranslation';

const tools: Tool[] = [
  {
    id: 'image-converter',
    name: 'tools.converter.name',
    description: 'tools.converter.description',
    path: '/image-converter',
    iconSmall: <Icons.Converter />,
  },
  {
    id: 'image-compressor',
    name: 'tools.compressor.name',
    description: 'tools.compressor.description',
    path: '/image-compressor',
    iconSmall: <Icons.Compress />,
  },
  {
    id: 'pdf-to-jpg',
    name: 'tools.pdfToJpg.name',
    description: 'tools.pdfToJpg.description',
    path: '/pdf-to-jpg',
    iconSmall: <Icons.Pdf />,
  },
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo 
        title={t('home.seo.title')}
        description={t('home.seo.description')}
        keywords={t('home.seo.keywords')}
      />
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 sm:pt-32 sm:pb-16 text-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
            <div className="inline-flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
                <Logo className="h-12 w-12 md:h-16 md:w-16" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                {t('home.hero.title')}
            </h1>
            <div className="flex justify-center mb-8">
                <div className="h-1.5 w-32 md:w-64 bg-gradient-to-r from-brand-cyan to-brand-magenta rounded-full"></div>
            </div>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto px-4 leading-relaxed">
                {t('home.hero.subtitle')}
            </p>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-cyan/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-magenta/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      </div>

      {/* Tools Section */}
      <div className="py-12 md:py-20 bg-slate-800/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
