const { ProductType, Subcategory, Category } = require('../models');
const fs = require('fs').promises;
const path = require('path');

exports.createProductType = async (productTypeData) => {
  try {
    // Kiểm tra subcategory tồn tại

    const productType = await ProductType.create(productTypeData);
    return {
      success: true,
      productType,
      message: 'Product type created successfully',
    };
  } catch (error) {
    // Xóa file nếu có lỗi
    console.log('Err', error);
    if (productTypeData.image_url) {
      try {
        const filePath = path.join(
          __dirname,
          '..',
          productTypeData.image_url.replace(/^\//, '')
        );
        await fs.unlink(filePath);
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

exports.getAllProductTypes = async () => {
  try {
    const productTypes = await ProductType.findAll({
      include: [
        {
          model: Subcategory,
          as: 'subcategory',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: [
                'category_id',
                'category_name_en',
                'category_name_vn',
              ],
            },
          ],
          attributes: [
            'subcategory_id',
            'subcategory_name_en',
            'subcategory_name_vn',
          ],
        },
      ],
      order: [['display_order', 'ASC']],
      attributes: [
        'product_type_id',
        'productType_name_en',
        'productType_name_vn',
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
      productTypes,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
