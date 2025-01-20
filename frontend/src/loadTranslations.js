const loadTranslations = () => {
  const modules = import.meta.glob('./locales/**/*.json', { eager: true });
  const translations = {};

  for (const path in modules) {
    const match = path.match(/\.\/locales\/(.+?)\/(.+?)\.json$/);
    if (match) {
      const [, lang, namespace] = match;
      if (!translations[lang]) {
        translations[lang] = {};
      }
      translations[lang][namespace] = modules[path]; // Gán nội dung JSON
    }
  }

  return translations;
};

export default loadTranslations;
