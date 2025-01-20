import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const useTranslationLoader = (namespace) => {
  const { loadNamespace } = useLanguage();

  useEffect(() => {
    loadNamespace(namespace);
  }, [namespace, loadNamespace]);
};
