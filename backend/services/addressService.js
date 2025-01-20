// services/addressService.js
const { AddressInfo, User } = require('../models');

exports.createAddress = async (addressData, user_id) => {
  try {
    const newAddress = await AddressInfo.create({
      ...addressData,
      user_id
    });

    return {
      success: true,
      data: newAddress
    };
  } catch (error) {
    console.error('Error creating address:', error);
    return {
      success: false,
      message: 'An error occurred while creating the address'
    };
  }
};

exports.updateAddress = async (addressData, user_id) => {
  try {
    const address = await AddressInfo.findOne({
      where: { user_id }
    });

    if (!address) {
      return {
        success: false,
        message: 'Address not found'
      };
    }

    const updatedAddress = await address.update(addressData);

    return {
      success: true,
      data: updatedAddress
    };
  } catch (error) {
    console.error('Error updating address:', error);
    return {
      success: false,
      message: 'An error occurred while updating the address'
    };
  }
};

exports.getAddressByUserId = async (user_id) => {
  try {
    const address = await AddressInfo.findOne({
      where: { user_id },
      attributes: {
        exclude: ['created_at', 'updated_at']
      }
    });

    if (!address) {
      return {
        success: false,
        message: 'Address not found'
      };
    }

    return {
      success: true,
      data: address
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    return {
      success: false,
      message: 'An error occurred while fetching the address'
    };
  }
};


exports.getAddressWithUserDetails = async (user_id) => {
  try {
    const addressWithUser = await AddressInfo.findOne({
      where: { user_id },
      attributes: {
        exclude: ['created_at', 'updated_at']
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['user_name', 'phone', 'email'],
        required: false
      }]
    });

    if (!addressWithUser) {
      return {
        success: false,
        message: 'Address not found'
      };
    }

    // Format the response to combine address and user details
    const formattedResponse = {
      ...addressWithUser.get(),
      user_name: addressWithUser.User?.user_name || null,
      phone: addressWithUser.User?.phone || null,
      email: addressWithUser.User?.email || null,
      User: undefined // Remove the nested User object
    };

    return {
      success: true,
      data: formattedResponse
    };
  } catch (error) {
    console.error('Error fetching address with user details:', error);
    return {
      success: false,
      message: 'An error occurred while fetching the address information'
    };
  }
};