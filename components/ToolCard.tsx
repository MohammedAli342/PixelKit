
import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { t } = useTranslation();
  return (
    <Link 
      to={tool.path}
      className="block h-full bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700 hover:border-brand-cyan/50 transform hover:-translate-y-1 transition-all duration-300 ease-in-out group no-underline"
    >
      <div className="p-6 md:p-8 flex flex-col items-start h-full">
        <div className="mb-4 md:mb-6">
          <div className="w-12 h-12 text-brand-cyan transition-transform duration-300 group-hover:scale-110 group-hover:text-white">
            {tool.iconSmall}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-brand-cyan transition-colors">{t(tool.name)}</h3>
        <p className="text-slate-300 text-sm md:text-base flex-grow mb-6 leading-relaxed">{t(tool.description)}</p>
        <div 
          className="mt-auto w-full md:w-auto text-center inline-block bg-slate-700 group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-brand-magenta text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
        >
          {t('toolCard.useTool')}
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
