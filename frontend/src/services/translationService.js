const API_URL = 'https://192.168.0.102:3000/api';

export const translationService = {
  async fetchTranslation(lang, namespace) {
    try {
      const response = await fetch(
        `${API_URL}/translations/${lang}/${namespace}`
      );
      if (!response.ok) throw new Error('Translation fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Error fetching translation:', error);
      return null;
    }
  },
};
