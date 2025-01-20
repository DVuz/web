const discountService = require('../services/discountService');

const createDiscount = async (req, res) => {
  try {
    const result = await discountService.createDiscount(req.body);
    if (!result.success) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (error) {
    console.error('Controller error creating discount:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAllDiscounts = async (req, res) => {
  try {
    const result = await discountService.getAllDiscounts(req.query);
    res.json(result);
  } catch (error) {
    console.error('Controller error fetching discounts:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getDiscountById = async (req, res) => {
  try {
    const result = await discountService.getDiscountById(req.params.id);
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  } catch (error) {
    console.error('Controller error fetching discount:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateDiscount = async (req, res) => {
  try {
    const result = await discountService.updateDiscount(
      req.params.id,
      req.body
    );
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (error) {
    console.error('Controller error updating discount:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const result = await discountService.deleteDiscount(req.params.id);
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  } catch (error) {
    console.error('Controller error deleting discount:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const validateDiscount = async (req, res) => {
  try {
    const { discount_code, user_id, order_amount } = req.body;
    const result = await discountService.validateDiscount(
      discount_code,
      user_id,
      order_amount
    );
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (error) {
    console.error('Controller error validating discount:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  validateDiscount,
};
