const fs = require('fs').promises;
const path = require('path');

// Hàm xóa một file
exports.deleteFile = async (filePath) => {
  try {
    if (filePath) {
      const fullPath = path.join(__dirname, '..', filePath);
      await fs.unlink(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

// Hàm xóa nhiều files
exports.deleteFiles = async (files) => {
  if (Array.isArray(files)) {
    await Promise.all(files.map((file) => exports.deleteFile(file)));
  }
};
