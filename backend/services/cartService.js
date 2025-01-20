// services/cartService.js
const { Cart, Product, User } = require('../models');
const baseURL = process.env.BASE_URL;

exports.AddToCart = async (user_id, product_id, quantity) => {
  try {
    // Check if user exists
    const user = await User.findOne({
      where: { user_id },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Check if product exists
    const product = await Product.findOne({
      where: { id: product_id },
    });

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    // Check if product already in cart
    const existingCartItem = await Cart.findOne({
      where: {
        user_id,
        product_id,
      },
    });

    if (existingCartItem) {
      // Update quantity if product already exists in cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();

      return {
        success: true,
        message: 'Cart quantity updated successfully',
        cart: existingCartItem,
      };
    }

    // Add new item to cart
    const cartItem = await Cart.create({
      user_id,
      product_id,
      quantity,
    });

    return {
      success: true,
      message: 'Product added to cart successfully',
      cart: cartItem,
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      message: 'An error occurred while adding to cart',
      error: error.message,
    };
  }
};

exports.RemoveFromCart = async (cart_id) => {
  try {
    const cartItem = await Cart.findByPk(cart_id);

    if (!cartItem) {
      return {
        success: false,
        message: 'Cart item not found',
      };
    }

    await cartItem.destroy();

    return {
      success: true,
      message: 'Product removed from cart successfully',
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      success: false,
      message: 'An error occurred while removing from cart',
      error: error.message,
    };
  }
};

exports.UpdateCartQuantity = async (cart_id, quantity) => {
  try {
    const cartItem = await Cart.findByPk(cart_id);

    if (!cartItem) {
      return {
        success: false,
        message: 'Cart item not found',
      };
    }

    if (quantity < 1) {
      return {
        success: false,
        message: 'Quantity must be at least 1',
      };
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return {
      success: true,
      message: 'Cart quantity updated successfully',
      cart: cartItem,
    };
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return {
      success: false,
      message: 'An error occurred while updating cart quantity',
      error: error.message,
    };
  }
};

exports.GetUserCart = async (user_id) => {
  try {
    const cartItems = await Cart.findAll({
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

    // Transform the cart items to include full image URLs
    const transformedCartItems = cartItems.map(item => {
      const cartItem = item.toJSON();
      // Check if product and main_image exist before modifying
      if (cartItem.product && cartItem.product.main_image) {
        cartItem.product.main_image = `${baseURL}${cartItem.product.main_image}`;
      }
      return cartItem;
    });

    // Calculate total price using the transformed items
    const totalPrice = transformedCartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    return {
      success: true,
      cartItems: transformedCartItems,
      totalPrice,
    };
  } catch (error) {
    console.error('Error getting user cart:', error);
    return {
      success: false,
      message: 'An error occurred while getting user cart',
      error: error.message,
    };
  }
};