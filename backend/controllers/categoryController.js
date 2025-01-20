const categoryService = require('../services/categoryService');
const path = require('path');
const { Category, Subcategory, ProductType } = require('../models');
exports.createCategory = async (req, res) => {
  try {
    let imagePath = null;

    if (req.file) {
      // Tạo đường dẫn tương đối cho database
      imagePath = `/uploads/categories/${req.file.filename}`;
    }

    const categoryData = {
      category_name_en: req.body.category_name_en?.trim(),
      category_name_vn: req.body.category_name_vn?.trim(),
      description_en: req.body.description_en,
      description_vn: req.body.description_vn,
      image_url: imagePath,
      display_order: parseInt(req.body.display_order) || 0,
      status: req.body.status || 'active',
    };

    const result = await categoryService.createCategory(categoryData);

    if (result.success) {
      res.status(201).json(result);
    } else {
      // Xóa file nếu tạo category thất bại
      if (req.file) {
        const filePath = path.join(__dirname, '..', req.file.path);
        require('fs').unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      res.status(400).json(result);
    }
  } catch (error) {
    // Xóa file nếu có lỗi
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

exports.getAllCategories = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};
exports.getAllCategoriesNested = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { status: 'active' },
      attributes: [
        'category_id',
        'category_name_en',
        'category_name_vn',
        'description_en',
        'description_vn',
        'image_url',
      ],
      include: [
        {
          model: Subcategory,
          as: 'subcategories',
          where: { status: 'active' },
          required: false, // LEFT JOIN
          attributes: [
            'subcategory_id',
            'subcategory_name_en',
            'subcategory_name_vn',
            'description_en',
            'description_vn',
            'image_url',
          ],
          include: [
            {
              model: ProductType,
              as: 'productTypes',
              where: { status: 'active' },
              required: false, // LEFT JOIN
              attributes: [
                'product_type_id',
                'productType_name_en',
                'productType_name_vn',
                'description_en',
                'description_vn',
                'image_url',
              ],
            },
          ],
        },
      ],
      order: [
        ['display_order', 'ASC'],
        ['category_name_en', 'ASC'],
        [{ model: Subcategory, as: 'subcategories' }, 'display_order', 'ASC'],
        [
          { model: Subcategory, as: 'subcategories' },
          'subcategory_name_en',
          'ASC',
        ],
        [
          { model: Subcategory, as: 'subcategories' },
          { model: ProductType, as: 'productTypes' },
          'display_order',
          'ASC',
        ],
        [
          { model: Subcategory, as: 'subcategories' },
          { model: ProductType, as: 'productTypes' },
          'productType_name_en',
          'ASC',
        ],
      ],
    });

    // Format response
    const formattedCategories = categories.map((category) => ({
      value: category.category_id,
      label_en: category.category_name_en,
      label_vn: category.category_name_vn,
      description_en: category.description_en,
      description_vn: category.description_vn,
      image_url: category.image_url,
      subcategories: category.subcategories.map((subcategory) => ({
        value: subcategory.subcategory_id,
        label_en: subcategory.subcategory_name_en,
        label_vn: subcategory.subcategory_name_vn,
        description: subcategory.description,
        description_vn: subcategory.description_vn,
        image_url: subcategory.image_url,
        productTypes: subcategory.productTypes.map((productType) => ({
          value: productType.product_type_id,
          label_en: productType.productType_name_en,
          label_vn: productType.productType_name_vn,
          description_en: productType.description_en,
          description_vn: productType.description_vn,
          image_url: productType.image_url,
        })),
      })),
    }));

    res.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error('Error fetching nested categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};
