// controllers/addressController.js
const addressService = require('../services/addressService');

exports.createOrUpdateAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const addressData = {
      country: req.body.country,
      city_id: req.body.city_id,
      district_id: req.body.district_id,
      ward_id: req.body.ward_id,
      address: req.body.address,
      exact_address: req.body.exact_address,
      note: req.body.note,
      longitude: req.body.longitude,
      latitude: req.body.latitude
    };

    // Validate required fields
    if (!addressData.country) {
      return res.status(400).json({
        success: false,
        message: 'Country is required'
      });
    }

    // Get existing address
    const existingAddress = await addressService.getAddressByUserId(user_id);
    
    // Update or create based on existence
    const result = existingAddress.success ? 
      await addressService.updateAddress(addressData, user_id) :
      await addressService.createAddress(addressData, user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in createOrUpdateAddress:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await addressService.getAddressByUserId(user_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getAddress:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
exports.getAddressWithUserDetails = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const result = await addressService.getAddressWithUserDetails(user_id);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};