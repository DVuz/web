const {
  Discount,
  DiscountUsage,
  DiscountProduct,
  DiscountCategory,
} = require('../models');
const { Op } = require('sequelize');

const createDiscount = async (discountData) => {
  try {
    const existingDiscount = await Discount.findOne({
      where: { discount_code: discountData.discount_code },
    });

    if (existingDiscount) {
      return { success: false, message: 'Discount code already exists' };
    }

    const discount = await Discount.create(discountData);

    if (discountData.products) {
      await DiscountProduct.bulkCreate(
        discountData.products.map((productId) => ({
          discount_id: discount.discount_id,
          product_id: productId,
        }))
      );
    }

    if (discountData.categories) {
      await DiscountCategory.bulkCreate(
        discountData.categories.map((categoryId) => ({
          discount_id: discount.discount_id,
          category_id: categoryId,
        }))
      );
    }

    return { success: true, discount };
  } catch (error) {
    console.error('Error creating discount:', error);
    return {
      success: false,
      message: 'An error occurred while creating the discount',
    };
  }
};

const getAllDiscounts = async (query = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      target_type,
      search,
      start_date,
      end_date,
    } = query;

    const where = {};

    if (status) where.status = status;
    if (target_type) where.target_type = target_type;
    if (search) {
      where[Op.or] = [
        { discount_code: { [Op.like]: `%${search}%` } },
        { discount_name: { [Op.like]: `%${search}%` } },
      ];
    }
    if (start_date) where.start_date = { [Op.gte]: start_date };
    if (end_date) where.end_date = { [Op.lte]: end_date };

    const offset = (page - 1) * limit;

    const { count, rows } = await Discount.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: ['products', 'categories'],
      order: [['created_at', 'DESC']],
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
    console.error('Error fetching discounts:', error);
    return {
      success: false,
      message: 'An error occurred while fetching discounts',
    };
  }
};

const getDiscountById = async (discountId) => {
  try {
    const discount = await Discount.findByPk(discountId, {
      include: ['products', 'categories', 'usages'],
    });

    if (!discount) {
      return { success: false, message: 'Discount not found' };
    }

    return { success: true, discount };
  } catch (error) {
    console.error('Error fetching discount:', error);
    return {
      success: false,
      message: 'An error occurred while fetching the discount',
    };
  }
};

const updateDiscount = async (discountId, updateData) => {
  try {
    const discount = await Discount.findByPk(discountId);

    if (!discount) {
      return { success: false, message: 'Discount not found' };
    }

    if (updateData.discount_code) {
      const existingDiscount = await Discount.findOne({
        where: {
          discount_code: updateData.discount_code,
          discount_id: { [Op.ne]: discountId },
        },
      });

      if (existingDiscount) {
        return { success: false, message: 'Discount code already exists' };
      }
    }

    await discount.update(updateData);

    if (updateData.products) {
      await DiscountProduct.destroy({ where: { discount_id: discountId } });
      await DiscountProduct.bulkCreate(
        updateData.products.map((productId) => ({
          discount_id: discountId,
          product_id: productId,
        }))
      );
    }

    if (updateData.categories) {
      await DiscountCategory.destroy({ where: { discount_id: discountId } });
      await DiscountCategory.bulkCreate(
        updateData.categories.map((categoryId) => ({
          discount_id: discountId,
          category_id: categoryId,
        }))
      );
    }

    return { success: true, discount };
  } catch (error) {
    console.error('Error updating discount:', error);
    return {
      success: false,
      message: 'An error occurred while updating the discount',
    };
  }
};

const deleteDiscount = async (discountId) => {
  try {
    const discount = await Discount.findByPk(discountId);

    if (!discount) {
      return { success: false, message: 'Discount not found' };
    }

    await DiscountProduct.destroy({ where: { discount_id: discountId } });
    await DiscountCategory.destroy({ where: { discount_id: discountId } });
    await DiscountUsage.destroy({ where: { discount_id: discountId } });
    await discount.destroy();

    return { success: true, message: 'Discount deleted successfully' };
  } catch (error) {
    console.error('Error deleting discount:', error);
    return {
      success: false,
      message: 'An error occurred while deleting the discount',
    };
  }
};

const validateDiscount = async (discountCode, userId, orderAmount) => {
  try {
    const discount = await Discount.findOne({
      where: {
        discount_code: discountCode,
        status: 'active',
        start_date: { [Op.lte]: new Date() },
        [Op.or]: [{ end_date: null }, { end_date: { [Op.gte]: new Date() } }],
      },
    });

    if (!discount) {
      return { success: false, message: 'Invalid or expired discount code' };
    }

    if (discount.min_order_amount && orderAmount < discount.min_order_amount) {
      return {
        success: false,
        message: `Minimum order amount required: ${discount.min_order_amount}`,
      };
    }

    const usageCount = await DiscountUsage.count({
      where: { discount_id: discount.discount_id },
    });

    if (usageCount >= discount.usage_limit) {
      return { success: false, message: 'Discount usage limit exceeded' };
    }

    if (userId) {
      const userUsageCount = await DiscountUsage.count({
        where: {
          discount_id: discount.discount_id,
          user_id: userId,
        },
      });

      if (userUsageCount >= discount.max_uses_per_user) {
        return {
          success: false,
          message: 'You have reached the maximum usage limit for this discount',
        };
      }
    }

    return { success: true, discount };
  } catch (error) {
    console.error('Error validating discount:', error);
    return {
      success: false,
      message: 'An error occurred while validating the discount',
    };
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
