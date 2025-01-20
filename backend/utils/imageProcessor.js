const fs = require('fs').promises;
const path = require('path');

const processBlobImage = async (fileData, uploadDir, prefix) => {
  if (!fileData || !fileData.buffer) {
    throw new Error('Invalid file data received');
  }

  try {
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(fileData.originalname) || '.jpg'; // Fallback extension
    const fileName = `${prefix}_${uniqueSuffix}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file
    await fs.writeFile(filePath, fileData.buffer);
    return fileName;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

module.exports = { processBlobImage };
