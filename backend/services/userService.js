const {
  User,
  Message,
  Conversation,
  ConversationMember,
  Sequelize,
} = require('../models');
const { Op } = require('sequelize');

const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

exports.CreateUser = async (user_name, email, gender, date_of_birth) => {
  try {
    // Kiểm tra nếu gender không phải là Male hoặc Female, thì gán là Other
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(gender)) {
      gender = 'Other'; // Gán 'Other' nếu giá trị không hợp lệ
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'Email is already in use' };
    }

    // Tạo người dùng mới
    const addUser = await User.create({
      user_name,
      email,
      gender,
      date_of_birth,
      last_login: new Date(),
    });

    // Trả về thông tin người dùng đã tạo thành công
    return { success: true, user: addUser };
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Error creating user:', error);
    return {
      success: false,
      message: 'An error occurred while creating the user',
    };
  }
};
exports.GetUserInfoByEmail = async (email) => {
  try {
    // Tìm người dùng dựa trên email
    const user = await User.findOne({
      where: { email },
      attributes: [
        'user_id',
        'user_name',
        'email',
        'phone',
        'language',
        'gender',
        'avatar_link',
        'date_of_birth',
        'user_role',
        'last_login',
        'registration_date',
        'account_status',
      ],
    });

    // Nếu không tìm thấy người dùng
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Trả về thông tin người dùng
    return { success: true, user };
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Error retrieving user info:', error);
    return {
      success: false,
      message: 'An error occurred while retrieving the user info',
    };
  }
};

exports.UpdateUserWithAvatar = async (email, userData, avatarFile = null) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Create update object with user data
    const updateData = {
      user_name: userData.user_name,
      phone: userData.phone,
      language: userData.language,
      gender: userData.gender,
      date_of_birth: userData.date_of_birth,
    };

    // Handle avatar updates
    if (avatarFile) {
      // New avatar uploaded
      if (user.avatar_link && !user.avatar_link.includes('default.jpg')) {
        const oldAvatarPath = path.join(
          __dirname,
          '..',
          'uploads',
          'avatars',
          path.basename(user.avatar_link)
        );
        try {
          await fs.access(oldAvatarPath);
          await fs.unlink(oldAvatarPath);
        } catch (error) {
          console.log('Old avatar file not found or could not be deleted');
        }
      }
      updateData.avatar_link = path
        .join('/uploads/avatars', avatarFile.filename)
        .replace(/\\/g, '/');
    } else if (userData.avatar_action === 'default') {
      // Explicitly set to default avatar
      updateData.avatar_link = '/uploads/avatars/default.jpg';

      // Delete old avatar if it exists
      if (user.avatar_link && !user.avatar_link.includes('default.jpg')) {
        const oldAvatarPath = path.join(
          __dirname,
          '..',
          'uploads',
          'avatars',
          path.basename(user.avatar_link)
        );
        try {
          await fs.access(oldAvatarPath);
          await fs.unlink(oldAvatarPath);
        } catch (error) {
          console.log('Old avatar file not found or could not be deleted');
        }
      }
    }
    // If neither condition is met, don't update avatar_link at all

    // Update user data
    const updatedUser = await user.update(updateData);

    return {
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: 'An error occurred while updating the user',
      error: error.message,
    };
  }
};
exports.searchUsers = async (searchTerm, currentUserId) => {
  try {
    // First, sanitize and prepare the search term
    // Trim whitespace and convert to lowercase for consistent matching
    const decodedSearchTerm = searchTerm.toString().trim().toLowerCase();
    // console.log('decodedSearchTerm:', decodedSearchTerm);
    // console.log('currentUserId:', currentUserId);

    // Find users matching the search term in either name or email
    const users = await User.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              // Case-insensitive search on user_name
              Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('user_name')),
                { [Op.like]: `%${decodedSearchTerm}%` }
              ),
              // Case-insensitive search on email
              Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), {
                [Op.like]: `%${decodedSearchTerm}%`,
              }),
            ],
          },
          // Exclude the current user from results
          { user_id: { [Op.ne]: currentUserId } },
        ],
      },
      attributes: [
        'user_id',
        'user_name',
        'email',
        'avatar_link',
        'last_login',
      ],
      collation: 'utf8mb4_unicode_ci',
    });

    // For each found user, get their last conversation with current user
    const usersWithConversation = await Promise.all(
      users.map(async (user) => {
        // Find common conversation between users, focusing on private conversations
        const commonConversation = await Conversation.findOne({
          where: {
            type: 'private', // Assuming we want to focus on private conversations
          },
          include: [
            {
              model: ConversationMember,
              as: 'ConversationMembers',
              where: {
                user_id: currentUserId,
                left_at: null,
              },
            },
            {
              model: ConversationMember,
              as: 'ConversationMembers',
              where: {
                user_id: user.user_id,
                left_at: null,
              },
            },
          ],
          order: [['last_message_at', 'DESC']],
        });

        // If conversation exists, get the last message
        let lastMessage = null;
        if (commonConversation) {
          lastMessage = await Message.findOne({
            where: {
              conversation_id: commonConversation.id,
              deleted_at: null,
            },
            include: [
              {
                model: User,
                as: 'sender',
                attributes: ['user_id', 'user_name'],
              },
            ],
            order: [['sent_at', 'DESC']],
          });
        }

        // Format the response with base URL for avatar
        const baseURL = process.env.BASE_URL || 'https://your-default-url.com';
        return {
          user_info: {
            user_id: user.user_id,
            user_name: user.user_name,
            email: user.email,
            avatar_link: user.avatar_link
              ? `${baseURL}${user.avatar_link}`
              : null,
            last_login: user.last_login,
          },
          last_interaction: lastMessage
            ? {
                message_content: lastMessage.content,
                sent_at: lastMessage.sent_at,
                sender: {
                  user_id: lastMessage.sender.user_id,
                  user_name: lastMessage.sender.user_name,
                },
              }
            : null,
        };
      })
    );

    return {
      success: true,
      data: usersWithConversation,
      total: usersWithConversation.length,
    };
  } catch (error) {
    console.error('Error in searchUsers service:', error);
    return {
      success: false,
      message: 'An error occurred while searching users',
      error: error.message,
    };
  }
};
