const discountUsageService = require('../services/discountUsageService');

const createDiscountUsage = async (req, res) => {
  try {
    const result = await discountUsageService.createDiscountUsage(req.body);
    if (!result.success) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getDiscountUsages = async (req, res) => {
  try {
    const result = await discountUsageService.getDiscountUsages(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getDiscountUsageById = async (req, res) => {
  try {
    const result = await discountUsageService.getDiscountUsageById(
      req.params.id
    );
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteDiscountUsage = async (req, res) => {
  try {
    const result = await discountUsageService.deleteDiscountUsage(
      req.params.id
    );
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createDiscountUsage,
  getDiscountUsages,
  getDiscountUsageById,
  deleteDiscountUsage,
};
