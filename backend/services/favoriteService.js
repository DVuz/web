// services/favoriteService.js
const { Favorite, Product, User } = require('../models');

exports.AddToFavorite = async (user_id, product_id) => {
  try {
    // Kiểm tra xem user có tồn tại không
    const user = await User.findOne({
      where: { user_id },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Kiểm tra xem product có tồn tại không
    const product = await Product.findOne({
      where: { id: product_id },
    });

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    // Kiểm tra xem sản phẩm đã được thêm vào favorite chưa
    const existingFavorite = await Favorite.findOne({
      where: {
        user_id,
        product_id,
      },
    });

    if (existingFavorite) {
      return {
        success: false,
        message: 'Product already in favorites',
      };
    }

    // Thêm vào favorites
    const favorite = await Favorite.create({
      user_id,
      product_id,
    });

    return {
      success: true,
      message: 'Product added to favorites successfully',
      favorite,
    };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return {
      success: false,
      message: 'An error occurred while adding to favorites',
      error: error.message,
    };
  }
};

exports.RemoveFromFavorite = async (user_id, product_id) => {
  try {
    // Tìm và xóa favorite
    const favorite = await Favorite.findOne({
      where: {
        user_id,
        product_id,
      },
    });

    if (!favorite) {
      return {
        success: false,
        message: 'Favorite not found',
      };
    }

    await favorite.destroy();

    return {
      success: true,
      message: 'Product removed from favorites successfully',
    };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return {
      success: false,
      message: 'An error occurred while removing from favorites',
      error: error.message,
    };
  }
};

exports.GetUserFavorites = async (user_id) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: [
            'id',
            'product_code',
            'product_name_en',
            'product_name_vn',
            'main_image',
            'price',
          ],
        },
      ],
    });

    return {
      success: true,
      favorites,
    };
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return {
      success: false,
      message: 'An error occurred while getting user favorites',
      error: error.message,
    };
  }
};
