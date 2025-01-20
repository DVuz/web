const { Manufacturer } = require('../models');

exports.createManufacturer = async (manufacturerData) => {
  try {
    // Check if manufacturer name already exists
    const existingManufacturer = await Manufacturer.findOne({
      where: { manufacturer_name: manufacturerData.manufacturer_name },
    });

    if (existingManufacturer) {
      return {
        success: false,
        message: 'Manufacturer name already exists',
      };
    }

    // Create new manufacturer
    const manufacturer = await Manufacturer.create(manufacturerData);

    return {
      success: true,
      message: 'Manufacturer created successfully',
      manufacturer,
    };
  } catch (error) {
    console.error('Error creating manufacturer:', error);
    throw error;
  }
};

exports.updateManufacturer = async (id, manufacturerData) => {
  try {
    const manufacturer = await Manufacturer.findByPk(id);

    if (!manufacturer) {
      return {
        success: false,
        message: 'Manufacturer not found',
      };
    }

    // Check name uniqueness if name is being changed
    if (manufacturerData.manufacturer_name !== manufacturer.manufacturer_name) {
      const existingManufacturer = await Manufacturer.findOne({
        where: { manufacturer_name: manufacturerData.manufacturer_name },
      });

      if (existingManufacturer) {
        return {
          success: false,
          message: 'Manufacturer name already exists',
        };
      }
    }

    // Store old logo URL for deletion if needed
    const oldLogoUrl = manufacturer.logo_url;

    // Update manufacturer
    await manufacturer.update(manufacturerData);

    return {
      success: true,
      message: 'Manufacturer updated successfully',
      manufacturer,
      oldLogoUrl: manufacturerData.logo_url ? oldLogoUrl : null,
    };
  } catch (error) {
    console.error('Error updating manufacturer:', error);
    throw error;
  }
};

exports.deleteManufacturer = async (id) => {
  try {
    const manufacturer = await Manufacturer.findByPk(id);

    if (!manufacturer) {
      return {
        success: false,
        message: 'Manufacturer not found',
      };
    }

    // Store logo URL for deletion
    const logoUrl = manufacturer.logo_url;

    // Soft delete by updating status to inactive
    await manufacturer.update({ status: 'inactive' });

    return {
      success: true,
      message: 'Manufacturer deleted successfully',
      logoUrl,
    };
  } catch (error) {
    console.error('Error deleting manufacturer:', error);
    throw error;
  }
};

exports.getManufacturerById = async (id) => {
  try {
    const manufacturer = await Manufacturer.findByPk(id);

    if (!manufacturer) {
      return {
        success: false,
        message: 'Manufacturer not found',
      };
    }

    return {
      success: true,
      manufacturer,
    };
  } catch (error) {
    console.error('Error fetching manufacturer:', error);
    throw error;
  }
};

exports.getAllManufacturers = async () => {
  try {
    const manufacturers = await Manufacturer.findAll({
      order: [['created_at', 'DESC']],
    });

    return {
      success: true,
      manufacturers,
    };
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    throw error;
  }
};

exports.getActiveManufacturers = async () => {
  try {
    const manufacturers = await Manufacturer.findAll({
      where: { status: 'active' },
      order: [['created_at', 'DESC']],
    });

    return {
      success: true,
      manufacturers,
    };
  } catch (error) {
    console.error('Error fetching active manufacturers:', error);
    throw error;
  }
};
