const { User } = require('../models');
const userService = require('../services/userService');
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      logging: false,
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUserInfoByEmail = async (req, res) => {
  const email = req.user.email;
  try {
    const rs = await userService.GetUserInfoByEmail(email);
    res.status(200).json(rs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateUserWithAvatar = async (req, res) => {
  try {
    const email = req.user.email;
    const userData = req.body;

    // Basic validation
    if (!userData.user_name) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
      });
    }

    // Existing validations...

    // Update user with or without avatar
    const result = await userService.UpdateUserWithAvatar(
      email,
      userData,
      req.file
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: result.user,
    });
  } catch (error) {
    console.error('Error in updateUserWithAvatar controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const currentUserId = req.user.id; // Assuming user info is attached to req by auth middleware

    console.log('searchTerm:', searchTerm);
    console.log('currentUserId:', currentUserId);
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required',
      });
    }

    const result = await userService.searchUsers(searchTerm, currentUserId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in searchUsers controller:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
    });
  }
};
