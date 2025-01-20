const shippingFeeService = require('../services/shippingFeeService');

exports.createShippingFee = async (req, res) => {
  try {
    const { min_distance, max_distance, fee } = req.body;

    const result = await shippingFeeService.createShippingFee(
      min_distance,
      max_distance,
      fee
    );

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.status(201).json(result.shippingFee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getShippingFees = async (req, res) => {
  try {
    const result = await shippingFeeService.getShippingFees();

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateShippingFee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await shippingFeeService.updateShippingFee(id, updates);

    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }

    res.json(result.shippingFee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteShippingFee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await shippingFeeService.deleteShippingFee(id);

    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }

    res.json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
