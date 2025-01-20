const e = require('express');
const subcategoryService = require('../services/subcategoryService');
const path = require('path');

exports.createSubcategory = async (req, res) => {
  try {
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/subcategories/${req.file.filename}`;
    }

    const subcategoryData = {
      category_id: req.body.category_id,
      subcategory_name_en: req.body.subcategory_name_en?.trim(),
      subcategory_name_vn: req.body.subcategory_name_vn?.trim(),
      description_en: req.body.description_en,
      description_vn: req.body.description_vn,
      image_url: imagePath,
      display_order: parseInt(req.body.display_order) || 0,
      status: req.body.status || 'active',
    };
    console.log(subcategoryData);
    const result = await subcategoryService.createSubcategory(subcategoryData);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    // Xóa file nếu upload thất bại
    console.log(error);
    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path);
      require('fs').unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllSubcategories = async (req, res) => {
  try {
    const result = await subcategoryService.getAllSubcategories();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subcategories',
      error: error.message,
    });
  }
};
