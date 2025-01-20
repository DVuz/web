const path = require('path');
const fs = require('fs').promises;

const translationController = {
  // Lấy translation theo namespace và language
  async getTranslation(req, res) {
    try {
      const { lang, namespace } = req.params;
      const filePath = path.join(
        __dirname,
        `../locales/${lang}/${namespace}.json`
      );

      const data = await fs.readFile(filePath, 'utf8');
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(404).json({ message: 'Translation not found' });
    }
  },

  // Lấy danh sách các namespace có sẵn
  async getAvailableNamespaces(req, res) {
    try {
      const { lang } = req.params;
      const localesPath = path.join(__dirname, `../locales/${lang}`);

      const files = await fs.readdir(localesPath);
      const namespaces = files.map((file) => path.parse(file).name);

      res.json(namespaces);
    } catch (error) {
      res.status(404).json({ message: 'Language not found' });
    }
  },
};

module.exports = translationController;
