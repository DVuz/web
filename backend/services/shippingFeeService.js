const { ShippingFee } = require('../models');

exports.createShippingFee = async (min_distance, max_distance, fee) => {
  try {
    const existingFee = await ShippingFee.findOne({
      where: {
        min_distance,
        max_distance,
        status: true,
      },
    });

    if (existingFee) {
      return { success: false, message: 'Shipping fee range already exists' };
    }

    const shippingFee = await ShippingFee.create({
      min_distance,
      max_distance,
      fee,
    });

    return { success: true, shippingFee };
  } catch (error) {
    console.error('Error creating shipping fee:', error);
    return {
      success: false,
      message: 'An error occurred while creating shipping fee',
    };
  }
};

exports.getShippingFees = async () => {
  try {
    const fees = await ShippingFee.findAll({
      where: { status: true },
      order: [['min_distance', 'ASC']],
    });

    return { success: true, fees };
  } catch (error) {
    console.error('Error getting shipping fees:', error);
    return {
      success: false,
      message: 'An error occurred while retrieving shipping fees',
    };
  }
};

exports.updateShippingFee = async (id, updates) => {
  try {
    const shippingFee = await ShippingFee.findByPk(id);

    if (!shippingFee) {
      return { success: false, message: 'Shipping fee not found' };
    }

    await shippingFee.update(updates);

    return { success: true, shippingFee };
  } catch (error) {
    console.error('Error updating shipping fee:', error);
    return {
      success: false,
      message: 'An error occurred while updating shipping fee',
    };
  }
};

exports.deleteShippingFee = async (id) => {
  try {
    const shippingFee = await ShippingFee.findByPk(id);

    if (!shippingFee) {
      return { success: false, message: 'Shipping fee not found' };
    }

    // Soft delete by setting status to false
    await shippingFee.update({ status: false });

    return { success: true, message: 'Shipping fee deleted successfully' };
  } catch (error) {
    console.error('Error deleting shipping fee:', error);
    return {
      success: false,
      message: 'An error occurred while deleting shipping fee',
    };
  }
};
