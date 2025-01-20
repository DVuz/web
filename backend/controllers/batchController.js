const { createBatch: createBatchService } = require('../services/batchService');
const batchService = require('../services/batchService');

exports.createBatch = async (req, res) => {
  try {
    const result = await createBatchService(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
exports.getBatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Prepare query parameters
    const queryParams = {
      page,
      limit,
      minTotalPrice: req.query.minTotalPrice,
      maxTotalPrice: req.query.maxTotalPrice,
      dateStart: req.query.dateStart,
      dateEnd: req.query.dateEnd,
      manufacturer_id: req.query.manufacturer_id,
      warehouse_id: req.query.warehouse_id,
      search: req.query.search,
    };

    const result = await batchService.getBatchesWithFilters(queryParams);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in getBatches controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get all batches without pagination
 */
exports.getAllBatches = async (req, res) => {
  try {
    const result = await batchService.getAllBatches();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in getAllBatches controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
