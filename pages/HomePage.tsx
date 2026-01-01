
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
      <div className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 text-center">
        <div className="container mx-auto px-4 relative z-10">
            <div className="inline-flex items-center justify-center mb-6">
                <Logo className="h-12 w-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                {t('home.hero.title')}
            </h1>
            <div className="flex justify-center">
                <div className="h-1.5 w-64 bg-gradient-to-r from-brand-cyan to-brand-magenta rounded-full"></div>
            </div>
            <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto">
                {t('home.hero.subtitle')}
            </p>
        </div>
      </div>

      {/* Tools Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
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