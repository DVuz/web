import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translationService } from '../services/translationService';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const storedLanguage = localStorage.getItem('language') || 'vi';
  const [language, setLanguage] = useState(storedLanguage);
  const [loadedNamespaces, setLoadedNamespaces] = useState(new Set());

  useEffect(() => {
    i18n.use(initReactI18next).init({
      lng: language,
      fallbackLng: 'vi',
      interpolation: {
        escapeValue: false,
      },
      ns: [], // Start with empty namespaces
      defaultNS: 'common',
    });
  }, []);

  const loadNamespace = async (namespace) => {
    if (!loadedNamespaces.has(namespace)) {
      const translations = await translationService.fetchTranslation(
        language,
        namespace
      );
      if (translations) {
        i18n.addResourceBundle(language, namespace, translations, true, true);
        setLoadedNamespaces((prev) => new Set([...prev, namespace]));
      }
    }
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);

    // Reload all loaded namespaces in new language
    for (const namespace of loadedNamespaces) {
      const translations = await translationService.fetchTranslation(
        lang,
        namespace
      );
      if (translations) {
        i18n.addResourceBundle(lang, namespace, translations, true, true);
      }
    }

    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, changeLanguage, loadNamespace }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
