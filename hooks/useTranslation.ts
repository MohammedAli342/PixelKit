
import { useContext } from 'react';
import { LanguageContext, LanguageContextType } from '../i18n/LanguageContext';

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
