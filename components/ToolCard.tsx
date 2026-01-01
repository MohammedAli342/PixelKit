
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
      className="block h-full bg-slate-800 rounded-2xl shadow-lg border border-slate-700 transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group no-underline"
    >
      <div className="p-8 flex flex-col items-start h-full">
        <div className="mb-4">
          <div className="w-12 h-12 text-brand-cyan transition-transform duration-300 group-hover:scale-110">
            {tool.iconSmall}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-brand-cyan transition-colors">{t(tool.name)}</h3>
        <p className="text-slate-300 flex-grow mb-6">{t(tool.description)}</p>
        <div 
          className="mt-auto inline-block bg-gradient-to-r from-brand-cyan to-brand-magenta text-white font-bold py-3 px-6 rounded-full shadow-lg group-hover:shadow-cyan-500/30 transition-all"
        >
          {t('toolCard.useTool')}
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
