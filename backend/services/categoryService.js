const { Category } = require('../models');
const fs = require('fs').promises;
const path = require('path');

exports.createCategory = async (categoryData) => {
  try {
    // Tạo category trong database
    const category = await Category.create(categoryData);

    return {
      success: true,
      category,
      message: 'Category created successfully',
    };
  } catch (error) {
    // Xóa file nếu tạo category thất bại
    if (categoryData.image_url) {
      try {
        await fs.unlink(
          path.join(__dirname, '..', 'public', categoryData.image_url)
        );
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    return {
      success: false,
      message: error.message,
    };
  }
};

exports.getAllCategories = async () => {
  try {
    const categories = await Category.findAll({
      order: [['display_order', 'ASC']],
      attributes: [
        'category_id',
        'category_name_en',
        'category_name_vn',
        'description_en',
        'description_vn',
        'image_url',
        'display_order',
        'status',
        'created_at',
        'updated_at',
      ],
    });

    return {
      success: true,
      categories,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
