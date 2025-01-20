const { Subcategory, Category } = require('../models');
const fs = require('fs').promises;
const path = require('path');

exports.createSubcategory = async (subcategoryData) => {
  try {
    // Kiểm tra category tồn tại
    const category = await Category.findByPk(subcategoryData.category_id);

    if (!category) {
      throw new Error('Category not found');
    }

    const subcategory = await Subcategory.create(subcategoryData);

    return {
      success: true,
      subcategory,
      message: 'Subcategory created successfully',
    };
  } catch (error) {
    console.log('2', error);
    if (subcategoryData.image_url) {
      try {
        await fs.unlink(path.join(__dirname, '..', subcategoryData.image_url));
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

exports.getAllSubcategories = async () => {
  try {
    const subcategories = await Subcategory.findAll({
      include: [
        {
          model: Category,
          as: 'category', // Thêm alias 'category' vào đây
          attributes: ['category_id', 'category_name_en', 'category_name_vn'],
        },
      ],
      order: [['display_order', 'ASC']],
      attributes: [
        'subcategory_id',
        'subcategory_name_en',
        'subcategory_name_vn',
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
      subcategories,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
