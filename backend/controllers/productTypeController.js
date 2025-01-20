const productTypeService = require('../services/productTypeService');
const path = require('path');
const fs = require('fs').promises;

exports.createProductType = async (req, res) => {
  try {
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/product-types/${req.file.filename}`;
    }

    const productTypeData = {
      subcategory_id: req.body.subcategory_id,
      productType_name_en: req.body.productType_name_en?.trim(),
      productType_name_vn: req.body.productType_name_vn?.trim(),
      description_en: req.body.description_en,
      description_vn: req.body.description_vn,
      image_url: imagePath,
      display_order: parseInt(req.body.display_order) || 0,
      status: req.body.status || 'active',
    };

    const result = await productTypeService.createProductType(productTypeData);

    if (!result.success && req.file) {
      const filePath = path.join(
        __dirname,
        '..',
        'uploads',
        'product-types',
        req.file.filename
      );
      await fs.unlink(filePath);
    }

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    if (req.file) {
      try {
        const filePath = path.join(
          __dirname,
          '..',
          'uploads',
          'product-types',
          req.file.filename
        );
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllProductTypes = async (req, res) => {
  try {
    const result = await productTypeService.getAllProductTypes();
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product types',
      error: error.message,
    });
  }
};
