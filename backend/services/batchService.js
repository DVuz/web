const {
  sequelize,
  Batch,
  BatchItem,
  ProductSerial,
  ProductInventory,
  Product,
  Manufacturer,
  Warehouse,
} = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

/**
 * Creates batch with batch items and product serials, updates inventory
 * @param {Object} data - Batch creation data
 * @returns {Promise<Object>} Result object with status and data
 */
const createBatch = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    // Calculate total price and total products from items
    const total_price = data.items.reduce((sum, item) => {
      return sum + parseFloat(item.unit_price) * parseInt(item.quantity);
    }, 0);

    const total_products = data.items.reduce((sum, item) => {
      return sum + parseInt(item.quantity);
    }, 0);

    // Create batch with calculated totals
    const batch = await Batch.create(
      {
        batch_name: data.batch_name,
        warehouse_id: data.warehouse_id,
        manufacturer_id: data.manufacturer_id,
        received_date: data.received_date,
        total_price: total_price,
        total_products: total_products,
      },
      { transaction }
    );

    // Create batch items and product serials
    const batchItems = [];
    const productSerials = [];
    const inventoryUpdates = [];

    // Process each item in the batch
    for (const item of data.items) {
      // Create batch item with explicit batch_id
      const batchItem = await BatchItem.create(
        {
          batch_id: batch.batch_id,
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
          total_price: parseInt(item.quantity) * parseFloat(item.unit_price),
        },
        { transaction }
      );

      batchItems.push(batchItem);

      // Generate product serials for each item
      const timestamp = moment().format('YYYYMMDDHHmmss');

      for (let i = 0; i < parseInt(item.quantity); i++) {
        const serialNumber = `DDS-${item.product_id}-${batch.batch_id}-${timestamp}-${i + 1}`;

        const productSerial = await ProductSerial.create(
          {
            product_id: parseInt(item.product_id),
            serial_number: serialNumber,
            batch_id: batch.batch_id,
            current_warehouse_id: parseInt(data.warehouse_id),
            status: 'in_stock',
            sold: false,
          },
          { transaction }
        );

        productSerials.push(productSerial);
      }

      // Update or create inventory record
      let inventory = await ProductInventory.findOne({
        where: { product_id: parseInt(item.product_id) },
        transaction,
      });

      if (inventory) {
        // Update existing inventory
        inventory.available_quantity =
          inventory.available_quantity + parseInt(item.quantity);
        inventory.last_updated = new Date();
        await inventory.save({ transaction });
      } else {
        // Create new inventory record
        inventory = await ProductInventory.create(
          {
            product_id: parseInt(item.product_id),
            available_quantity: parseInt(item.quantity),
            reserved_quantity: 0,
            last_updated: new Date(),
          },
          { transaction }
        );
      }

      inventoryUpdates.push(inventory);
    }

    await transaction.commit();

    return {
      success: true,
      data: {
        batch,
        batchItems,
        productSerials,
        inventoryUpdates,
      },
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating batch:', error);

    return {
      success: false,
      error: error.message || 'Failed to create batch',
    };
  }
};
const getBatchesWithFilters = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    minTotalPrice,
    maxTotalPrice,
    dateStart,
    dateEnd,
    manufacturer_id,
    warehouse_id,
    search,
  } = queryParams;

  try {
    const offset = (page - 1) * limit;

    // Build filter conditions
    const where = {};

    // Total price filter
    if (minTotalPrice || maxTotalPrice) {
      where.total_price = {};
      if (minTotalPrice) where.total_price[Op.gte] = parseFloat(minTotalPrice);
      if (maxTotalPrice) where.total_price[Op.lte] = parseFloat(maxTotalPrice);
    }

    // Date filter
    if (dateStart || dateEnd) {
      where.received_date = {};
      if (dateStart) where.received_date[Op.gte] = new Date(dateStart);
      if (dateEnd) where.received_date[Op.lte] = new Date(dateEnd);
    }

    // Manufacturer filter
    if (manufacturer_id) {
      where.manufacturer_id = parseInt(manufacturer_id);
    }

    // Warehouse filter
    if (warehouse_id) {
      where.warehouse_id = parseInt(warehouse_id);
    }

    // Search by batch name
    if (search) {
      where.batch_name = { [Op.like]: `%${search}%` };
    }

    // Get batches with pagination and relations
    const { rows: batches, count: totalItems } = await Batch.findAndCountAll({
      where,
      include: [
        {
          model: BatchItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_name_vn', 'product_code', 'main_image'],
            },
          ],
        },
        {
          model: Manufacturer,
          as: 'manufacturer',
          attributes: ['manufacturer_name', 'phone_number'],
        },
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['name', 'address'],
        },
      ],
      distinct: true,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['received_date', 'DESC']],
    });

    const totalPages = Math.ceil(totalItems / limit);

    // Format response
    const formattedBatches = batches.map((batch) => {
      const plainBatch = batch.get({ plain: true });
      return {
        ...plainBatch,
        received_date: plainBatch.received_date
          ? new Date(plainBatch.received_date).toISOString()
          : null,
        created_at: plainBatch.created_at
          ? new Date(plainBatch.created_at).toISOString()
          : null,
        total_price: parseFloat(plainBatch.total_price),
      };
    });

    return {
      batches: formattedBatches,
      currentPage: parseInt(page),
      totalPages,
      totalItems,
      itemsPerPage: parseInt(limit),
    };
  } catch (error) {
    console.error('Error in getBatchesWithFilters service:', error);
    throw error;
  }
};

/**
 * Get all batches without pagination
 */
const getAllBatches = async () => {
  try {
    const batches = await Batch.findAll({
      include: [
        {
          model: BatchItem,
          as: 'items', // Changed from 'batchItems' to 'items'
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_name_vn', 'product_code', 'main_image'],
            },
          ],
        },
        {
          model: Manufacturer,
          as: 'manufacturer',
          attributes: ['manufacturer_name', 'phone_number'],
        },
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['name', 'address'],
        },
      ],
      order: [['received_date', 'DESC']],
    });

    // Format response
    const formattedBatches = batches.map((batch) => {
      const plainBatch = batch.get({ plain: true });
      return {
        ...plainBatch,
        received_date: plainBatch.received_date
          ? new Date(plainBatch.received_date).toISOString()
          : null,
        created_at: plainBatch.created_at
          ? new Date(plainBatch.created_at).toISOString()
          : null,
        total_price: parseFloat(plainBatch.total_price),
      };
    });

    return formattedBatches;
  } catch (error) {
    console.error('Error in getAllBatches service:', error);
    throw error;
  }
};

module.exports = {
  createBatch,
  getBatchesWithFilters,
  getAllBatches,
};
