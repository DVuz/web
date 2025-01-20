// controllers/cartController.js
const cartService = require('../services/cartService');

exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const result = await cartService.AddToCart(user_id, product_id, quantity);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { cart_id } = req.params;

    if (!cart_id) {
      return res.status(400).json({
        success: false,
        message: 'Cart ID is required',
      });
    }

    const result = await cartService.RemoveFromCart(cart_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { cart_id } = req.params;
    const { quantity } = req.body;

    if (!cart_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const result = await cartService.UpdateCartQuantity(cart_id, quantity);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getUserCart = async (req, res) => {
  // console.log(req.user.id)
  try {
    const  user_id  = req.user.id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const result = await cartService.GetUserCart(user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
