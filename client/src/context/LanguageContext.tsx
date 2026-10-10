import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, translations, LanguageOption } from '../i18n/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  currentOption: LanguageOption;
  supportedLanguages: LanguageOption[];
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('travelxp_lang') || 'en';
  });

  const currentOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const isRtl = currentOption.dir === 'rtl';

  useEffect(() => {
    localStorage.setItem('travelxp_lang', language);
    // Update document language and text direction attributes
    document.documentElement.lang = language;
    document.documentElement.dir = currentOption.dir;
  }, [language, currentOption]);

  const setLanguage = (lang: string) => {
    const exists = SUPPORTED_LANGUAGES.some((l) => l.code === lang);
    if (exists) {
      setLanguageState(lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    // 1. Try selected language
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // 2. Fall back to English
    const enDict = translations['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    // 3. Fall back to supplied fallback or key itself
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentOption,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t,
        isRtl,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
