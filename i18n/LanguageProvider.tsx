
import React, { useState, useEffect, useCallback } from 'react';
import { LanguageContext } from './LanguageContext';
import en from '../locales/en.ts';
import ar from '../locales/ar.ts';
import fr from '../locales/fr.ts';
import zh from '../locales/zh.ts';
import tr from '../locales/tr.ts';

const translations: Record<string, any> = { en, ar, fr, zh, tr };

const getNestedTranslation = (language: string, key: string): string | undefined => {
  return key.split('.').reduce((obj, k) => (obj ? obj[k] : undefined), translations[language]);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage && translations[savedLanguage] ? savedLanguage : 'en';
  });

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    let translation = getNestedTranslation(language, key);
    
    if (!translation) {
      console.warn(`Translation key "${key}" not found for language "${language}". Falling back to English.`);
      translation = getNestedTranslation('en', key);
    }

    if (!translation) {
      return key; // Return the key itself if not found in English either
    }

    if (options) {
      Object.keys(options).forEach((k) => {
        translation = translation!.replace(`{{${k}}}`, String(options[k]));
      });
    }

    return translation!;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};