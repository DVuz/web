// services/discountUsageService.js
const { DiscountUsage, Discount, User } = require('../models');

const createDiscountUsage = async (usageData) => {
  try {
    const existingUsage = await DiscountUsage.findOne({
      where: {
        discount_id: usageData.discount_id,
        user_id: usageData.user_id,
        order_id: usageData.order_id,
      },
    });

    if (existingUsage) {
      return {
        success: false,
        message: 'Discount usage already recorded for this order',
      };
    }

    const usage = await DiscountUsage.create(usageData);
    return { success: true, usage };
  } catch (error) {
    console.error('Error creating discount usage:', error);
    return {
      success: false,
      message: 'An error occurred while recording discount usage',
    };
  }
};

const getDiscountUsages = async (query = {}) => {
  try {
    const { page = 1, limit = 10, discount_id, user_id } = query;
    const where = {};

    if (discount_id) where.discount_id = discount_id;
    if (user_id) where.user_id = user_id;

    const { count, rows } = await DiscountUsage.findAndCountAll({
      where,
      include: [
        { model: Discount, as: 'discount' },
        { model: User, as: 'user' },
      ],
      limit: parseInt(limit),
      offset: (page - 1) * parseInt(limit),
      order: [['used_at', 'DESC']],
    });

    return {
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching discount usages:', error);
    return {
      success: false,
      message: 'An error occurred while fetching discount usages',
    };
  }
};

const getDiscountUsageById = async (id) => {
  try {
    const usage = await DiscountUsage.findByPk(id, {
      include: [
        { model: Discount, as: 'discount' },
        { model: User, as: 'user' },
      ],
    });

    if (!usage) {
      return { success: false, message: 'Discount usage not found' };
    }

    return { success: true, usage };
  } catch (error) {
    console.error('Error fetching discount usage:', error);
    return {
      success: false,
      message: 'An error occurred while fetching the discount usage',
    };
  }
};

const deleteDiscountUsage = async (id) => {
  try {
    const usage = await DiscountUsage.findByPk(id);
    if (!usage) {
      return { success: false, message: 'Discount usage not found' };
    }

    await usage.destroy();
    return { success: true, message: 'Discount usage deleted successfully' };
  } catch (error) {
    console.error('Error deleting discount usage:', error);
    return {
      success: false,
      message: 'An error occurred while deleting the discount usage',
    };
  }
};

module.exports = {
  createDiscountUsage,
  getDiscountUsages,
  getDiscountUsageById,
  deleteDiscountUsage,
};
