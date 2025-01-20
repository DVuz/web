const productService = require('../services/productService');
const fs = require('fs').promises;
const path = require('path');

// Hàm tiện ích để xóa files
const cleanupFiles = async (mainImagePath, subImagesPaths) => {
  try {
    // Xóa main image
    if (mainImagePath) {
      const fullMainPath = path.join(__dirname, '..', mainImagePath);
      await fs.unlink(fullMainPath);
      console.log(`Deleted main image: ${fullMainPath}`);
    }

    // Xóa sub images
    if (Array.isArray(subImagesPaths)) {
      for (const subPath of subImagesPaths) {
        const fullSubPath = path.join(__dirname, '..', subPath);
        await fs.unlink(fullSubPath);
        console.log(`Deleted sub image: ${fullSubPath}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up files:', error);
  }
};

exports.createProduct = async (req, res) => {
  let mainImagePath = null;
  let subImagesPaths = [];

  try {
    const { body, files } = req;
    // console.log('body', body);

    // Lấy đường dẫn ảnh chính
    if (files.mainImage?.[0]) {
      mainImagePath = `/uploads/products/product-main/${files.mainImage[0].filename}`;
    }

    // Lấy đường dẫn ảnh phụ
    if (files.subImages?.length) {
      subImagesPaths = files.subImages.map(
        (file) => `/uploads/products/product-sub/${file.filename}`
      );
    }

    // Gọi service để tạo sản phẩm
    const result = await productService.createProduct(
      body,
      files,
      mainImagePath,
      subImagesPaths
    );

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: result.product,
      });
    }

    // Nếu có lỗi từ service, xóa files và trả về lỗi
    await cleanupFiles(mainImagePath, subImagesPaths);
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in createProduct controller:', error);

    // Xóa files khi có lỗi không xác định
    await cleanupFiles(mainImagePath, subImagesPaths);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// exports.getProducts = async (req, res) => {
//   try {
//     const { page = 1, ...filters } = req.query;

//     // Gọi service để lấy danh sách sản phẩm
//     const result = await productService.getProductsWithPrices(Number(page), filters);

//     if (!result.success) {
//       return res.status(404).json({
//         success: false,
//         message: result.message
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: result.data
//     });
//   } catch (error) {
//     console.error('Error in getProducts controller:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Prepare query parameters
    const queryParams = {
      page,
      limit,
      status: req.query.status,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      dateStart: req.query.dateStart,
      dateEnd: req.query.dateEnd,
      search: req.query.search,
      color: req.query.color,
    };

    // console.log(minPrice, maxPrice);
    const result = await productService.getProductsWithPrices(queryParams);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in getProducts controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    // Gọi service getAllProducts để lấy toàn bộ sản phẩm
    const result = await productService.getAllProducts();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in getProducts controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
exports.getProductByName = async (req, res) => {
  try {
    const { productName } = req.params;

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
      });
    }

    const result = await productService.getProductByName(productName);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Error in getProductByName controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
