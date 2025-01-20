const { Product, ProductType } = require('../models');
const { Op, Sequelize } = require('sequelize');
const baseUrl = process.env.BASE_URL || 'https://192.168.0.102:3000';

exports.createProduct = async (
  productData,
  files,
  mainImagePath,
  subImagesPaths
) => {
  try {
    // Kiểm tra trùng lặp
    const [existingProduct, existingName] = await Promise.all([
      Product.findOne({ where: { product_code: productData.product_code } }),
      Product.findOne({
        where: { product_name_en: productData.product_name_en?.trim() },
      }),
    ]);

    if (existingProduct) {
      return { success: false, message: 'Product code already exists' };
    }

    if (existingName) {
      return { success: false, message: 'Product name already exists' };
    }

    // Tạo đối tượng sản phẩm
    const product = {
      product_code: productData.product_code,
      product_name_en: productData.product_name_en?.trim(),
      product_name_vn: productData.product_name_vn?.trim(),
      main_image: mainImagePath,
      sub_image: JSON.stringify(subImagesPaths),
      length: productData.length,
      width: productData.width,
      height: productData.height,
      material: productData.material,
      material_vn: productData.material_vn,
      description: productData.description_en,
      description_vn: productData.description_vn,
      quantity_purchased: productData.quantity_purchased || 0,
      quantity_viewed: productData.quantity_viewed || 0,
      origin: productData.origin,
      origin_vn: productData.origin_vn,
      color: productData.color,
      color_vn: productData.color_vn,
      product_type_id: productData.productType,
      detail_description: JSON.parse(
        productData.detailDescriptionSections || '[]'
      ),
      public_date: productData.public_date,
      visibility_status: productData.visibility_status,
      warranty_period: productData.warranty_period,
      price: productData.price,
    };

    // Lưu sản phẩm vào database
    const newProduct = await Product.create(product);

    return { success: true, product: newProduct };
  } catch (error) {
    console.error('Error in creating product:', error);
    return { success: false, message: error.message };
  }
};
// exports.getProductsWithPrices = async (page = 1, filters = {}) => {
//   try {
//     const limit = 3;
//     const offset = (page - 1) * limit;

//     // Lấy danh sách sản phẩm
//     const { rows: products, count: totalItems } = await Product.findAndCountAll({
//       where: filters,
//       include: [
//         {
//           model: ProductPrice,
//           as: 'prices',
//           attributes: [
//             'price_id',
//             'price',
//             'effective_date',
//             'valid_until_date',
//             'price_change_reason',
//             'is_active',
//           ],
//         },
//         {
//           model: ProductType,
//           as: 'productType', // Quan hệ với ProductType
//           attributes: ['productType_name_en', 'productType_name_vn'],
//         },
//       ],
//       attributes: [
//         'id',
//         'product_code',
//         'product_name__en',
//         'product_name_vn',
//         'main_image',
//         'length',
//         'width',
//         'height',
//         'color',
//         'origin',
//         'material',
//         'product_type_id',
//         'warranty_period',
//         'quantity_purchased',
//         'visibility_status',
//         'created_at', // Sửa thành created_at
//         'updated_at', // Sửa thành updated_at
//       ],
//       limit,
//       offset,
//       order: [['created_at', 'DESC']], // Sửa thành created_at
//     });

//     if (!products.length) {
//       return {
//         success: false,
//         message: 'No products found',
//         data: {
//           products: [],
//           currentPage: page,
//           totalPages: 0,
//           totalItems: 0,
//         },
//       };
//     }

//     const totalPages = Math.ceil(totalItems / limit);

//     // Format dates trong response nếu cần
//     const formattedProducts = products.map((product) => {
//       const plainProduct = product.get({ plain: true });
//       return {
//         ...plainProduct,
//         created_at: plainProduct.created_at
//           ? new Date(plainProduct.created_at).toISOString()
//           : null,
//         updated_at: plainProduct.updated_at
//           ? new Date(plainProduct.updated_at).toISOString()
//           : null,
//         productType: plainProduct.productType || {}, // Thêm productType vào kết quả
//       };
//     });

//     return {
//       success: true,
//       data: {
//         products: formattedProducts,
//         currentPage: page,
//         totalPages,
//         totalItems,
//       },
//     };
//   } catch (error) {
//     console.error('Error in fetching products with prices:', error);
//     return {
//       success: false,
//       message: error.message,
//       data: {
//         products: [],
//         currentPage: page,
//         totalPages: 0,
//         totalItems: 0,
//       },
//     };
//   }
// };

exports.getProductsWithPrices = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    status,
    minPrice,
    maxPrice,
    dateStart,
    dateEnd,
    search,
    color,
  } = queryParams;

  try {
    const offset = (page - 1) * limit;

    // Build filter conditions
    const where = {};

    if (status) {
      where.visibility_status = status;
    }

    if (minPrice || maxPrice) {
      where.price = {}; // Filtering directly on the price field of Product
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (dateStart || dateEnd) {
      where.created_at = {};
      if (dateStart) where.created_at[Op.gte] = new Date(dateStart);
      if (dateEnd) where.created_at[Op.lte] = new Date(dateEnd);
    }

    if (search) {
      where[Op.or] = [
        { product_code: { [Op.like]: `%${search}%` } },
        { product_name_en: { [Op.like]: `%${search}%` } },
        { product_name_vn: { [Op.like]: `%${search}%` } },
      ];
    }

    if (color) {
      where.color = color;
    }

    // Get products with pagination
    const { rows: products, count: totalItems } = await Product.findAndCountAll(
      {
        where,
        include: [
          {
            model: ProductType,
            as: 'productType',
            attributes: ['productType_name_en', 'productType_name_vn'],
          },
        ],
        distinct: true,
        limit,
        offset,
        order: [['created_at', 'DESC']],
      }
    );

    const totalPages = Math.ceil(totalItems / limit);

    // Format response
    const formattedProducts = products.map((product) => {
      const plainProduct = product.get({ plain: true });
      return {
        ...plainProduct,
        created_at: plainProduct.created_at
          ? new Date(plainProduct.created_at).toISOString()
          : null,
        updated_at: plainProduct.updated_at
          ? new Date(plainProduct.updated_at).toISOString()
          : null,
        productType: plainProduct.productType || {},
        main_image: plainProduct.main_image
          ? `${baseUrl}${plainProduct.main_image}`
          : null,

      };
    });

    return {
      products: formattedProducts,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
    };
  } catch (error) {
    console.error('Error in getProductsWithPrices service:', error);
    throw error;
  }
};
exports.getAllProducts = async () => {
  try {
    // Get all products without pagination
    const products = await Product.findAll({
      include: [
        {
          model: ProductType,
          as: 'productType',
          attributes: ['productType_name_en', 'productType_name_vn'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // Format response while preserving detail_description as is
    const formattedProducts = products.map((product) => {
      const plainProduct = product.get({ plain: true });
      // No transformation on detail_description
      return {
        ...plainProduct,
        created_at: plainProduct.created_at
          ? new Date(plainProduct.created_at).toISOString()
          : null,
        updated_at: plainProduct.updated_at
          ? new Date(plainProduct.updated_at).toISOString()
          : null,
        productType: plainProduct.productType || {},
        detail_description: plainProduct.detail_description, // Keep the original value
        main_image: plainProduct.main_image
        ? `${baseUrl}${plainProduct.main_image}`
        : null,
      };
    });

    return formattedProducts;
  } catch (error) {
    console.error('Error in getAllProducts service:', error);
    throw error;
  }
};
exports.getProductByName = async (productName) => {
  try {
    // Decode URL và chuẩn hóa chuỗi tìm kiếm
    const decodedName = decodeURIComponent(productName)
      .toLowerCase()
      .trim()
      .replace(/-/g, ' '); // Thay thế dấu "-" bằng khoảng trắng
    // console.log('decodedName', decodedName);
    console.log('decodedName', decodedName);
    // Tìm sản phẩm với điều kiện chính xác
    const product = await Product.findOne({
      where: {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('product_name_en')),
            decodedName
          ),
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('product_name_vn')),
            decodedName
          ),
        ],
      },
      include: [
        {
          model: ProductType,
          as: 'productType',
          attributes: ['productType_name_en', 'productType_name_vn'],
        },
      ],
    });

    if (!product) {
      return {
        success: false,
        message: 'Không tìm thấy sản phẩm',
      };
    }

    const formattedProduct = {
      ...product.get({ plain: true }),
      created_at: product.created_at
        ? new Date(product.created_at).toISOString()
        : null,
      updated_at: product.updated_at
        ? new Date(product.updated_at).toISOString()
        : null,
      productType: product.productType || {},
    };

    return {
      success: true,
      data: formattedProduct,
    };
  } catch (error) {
    console.error('Error in getProductByName service:', error);
    throw error;
  }
};
