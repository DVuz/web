const { Op } = require('sequelize');
const { DirectMessage } = require('../models');

exports.GetRecentMessagesBetweenUsers = async (sender_id, receiver_id) => {
  try {
    // Tìm 10 tin nhắn mới nhất giữa hai người dùng
    const messages = await DirectMessage.findAll({
      where: {
        [Op.or]: [
          { sender_id, receiver_id }, // Tin nhắn từ sender_id tới receiver_id
          { sender_id: receiver_id, receiver_id: sender_id }, // Tin nhắn từ receiver_id tới sender_id
        ],
      },
      order: [['id', 'DESC']], // Sắp xếp theo thời gian gửi, mới nhất trước
      limit: 10, // Chỉ lấy 10 tin nhắn mới nhất
    });

    // Nếu không tìm thấy tin nhắn
    if (messages.length === 0) {
      return {
        success: false,
        message: 'No messages found between these users',
      };
    }

    // Kiểm tra các tin nhắn có type là 'video' hoặc 'image' và chuyển content từ JSON string thành mảng/đối tượng
    messages.forEach((message) => {
      if (message.type === 'video' || message.type === 'image') {
        try {
          message.content = JSON.parse(message.content); // Chuyển content từ JSON string thành mảng hoặc đối tượng
        } catch (error) {
          console.error('Error parsing content:', error);
          message.content = []; // Nếu có lỗi trong quá trình parse, gán content thành mảng rỗng
        }
      }
    });

    // Trả về danh sách tin nhắn
    return { success: true, messages };
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Error retrieving messages:', error);
    return {
      success: false,
      message: 'An error occurred while retrieving messages',
    };
  }
};

exports.CreateNewMessage = async (sender_id, receiver_id, content, type) => {
  try {
    // Kiểm tra nếu nội dung tin nhắn là text và type có phải là 'text'
    if (type === 'text') {
      // Nếu type là text, kiểm tra xem content có phải là chuỗi không trống
      if (typeof content !== 'string' || content.trim() === '') {
        return {
          success: false,
          message: 'Content must be a non-empty string for text messages',
        };
      }
    } else if (type === 'image' || type === 'video') {
      // Nếu type là image (hoặc loại khác), kiểm tra nếu content là mảng URL
      if (!Array.isArray(content) || content.length === 0) {
        return {
          success: false,
          message:
            'Content must be a non-empty array of URLs for image messages',
        };
      }
      // Nếu là image, chuyển content thành chuỗi JSON
      content = JSON.stringify(content);
    } else {
      // Nếu type không phải 'text' hoặc 'image', trả về lỗi
      return {
        success: false,
        message: 'Invalid message type. Only "text" and "image" are allowed',
      };
    }

    // Tạo tin nhắn mới
    const newMessage = await DirectMessage.create({
      sender_id,
      receiver_id,
      content,
      type,
      sent_time: new Date(),
      read_time: null,
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Trả về kết quả nếu tin nhắn được tạo thành công
    return {
      success: true,
      message: 'Message created successfully',
      newMessage,
    };
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Error creating message:', error);
    return {
      success: false,
      message: 'An error occurred while creating the message',
    };
  }
};

exports.searchMessages = async (sender_id, receiver_id, searchTerm) => {
  try {
    // Kiểm tra nếu từ tìm kiếm là chuỗi không trống
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return {
        success: false,
        message: 'Search term must be a non-empty string',
      };
    }

    // Kiểm tra nếu sender_id và receiver_id là số và hợp lệ
    if (
      !sender_id ||
      !receiver_id ||
      typeof sender_id !== 'number' ||
      typeof receiver_id !== 'number'
    ) {
      return { success: false, message: 'Invalid sender or receiver ID' };
    }

    // Tìm các tin nhắn có chứa từ khóa trong content, chỉ tìm loại tin nhắn là 'text'
    const messages = await DirectMessage.findAll({
      where: {
        content: {
          [Op.like]: `%${searchTerm}%`, // Tìm kiếm các tin nhắn có chứa searchTerm
        },
        type: 'text', // Kiểm tra chỉ các tin nhắn có type là 'text'
        [Op.or]: [
          // Tìm tin nhắn giữa sender_id và receiver_id, hoặc ngược lại
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      },
      order: [['sent_time', 'DESC']], // Sắp xếp theo thời gian gửi, mới nhất trước
    });

    // Kiểm tra nếu không có tin nhắn nào khớp
    const length = messages.length;
    if (messages.length === 0) {
      return {
        success: false,
        message: 'No messages found matching the search term',
      };
    }

    // Trả về kết quả tin nhắn tìm được
    return { success: true, length: length, messages };
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Error searching messages:', error);
    return {
      success: false,
      message: 'An error occurred while searching for messages',
    };
  }
};
exports.GetRecentMessagesWithMedia = async (sender_id, receiver_id) => {
  try {
    // Tìm 10 tin nhắn mới nhất có loại là 'image' hoặc 'video' giữa hai người dùng
    const messages = await DirectMessage.findAll({
      where: {
        [Op.or]: [
          { sender_id, receiver_id }, // Tin nhắn từ sender_id tới receiver_id
          { sender_id: receiver_id, receiver_id: sender_id }, // Tin nhắn từ receiver_id tới sender_id
        ],
        type: { [Op.in]: ['image', 'video'] }, // Lọc chỉ các tin nhắn có type là 'image' hoặc 'video'
      },
      order: [['sent_time', 'DESC']], // Sắp xếp theo thời gian gửi, mới nhất trước
      limit: 10, // Chỉ lấy 10 tin nhắn mới nhất
    });

    // Nếu không tìm thấy tin nhắn
    if (messages.length === 0) {
      return {
        success: false,
        message: 'No media messages found between these users',
      };
    }

    // Kiểm tra các tin nhắn có type là 'video' hoặc 'image' và chuyển content từ JSON string thành mảng/đối tượng
    messages.forEach((message) => {
      if (message.type === 'video' || message.type === 'image') {
        try {
          message.content = JSON.parse(message.content); // Chuyển content từ JSON string thành mảng hoặc đối tượng
        } catch (error) {
          console.error('Error parsing content:', error);
          message.content = []; // Nếu có lỗi trong quá trình parse, gán content thành mảng rỗng
        }
      }
    });

    // Trả về danh sách tin nhắn chứa ảnh hoặc video
    return { success: true, messages };
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Error retrieving media messages:', error);
    return {
      success: false,
      message: 'An error occurred while retrieving media messages',
    };
  }
};
exports.UpdateMessage = async (id, sender_id, new_content) => {
  try {
    // Tìm tin nhắn cần cập nhật
    const message = await DirectMessage.findOne({
      where: {
        id: id,
        sender_id: sender_id,
      },
    });

    // Kiểm tra xem tin nhắn có tồn tại không
    if (!message) {
      return {
        success: false,
        message:
          'Message not found or you do not have permission to update this message',
      };
    }

    // Kiểm tra type của tin nhắn
    if (message.type !== 'text') {
      return {
        success: false,
        message: 'Only text messages can be updated',
      };
    }

    // Tính thời gian từ lúc gửi tin nhắn
    const messageTime = new Date(message.sent_time);
    const currentTime = new Date();
    const currentTimeInUTCPlus7 = new Date(
      currentTime.getTime() + 7 * 60 * 60 * 1000
    );
    console.log('Message time:', messageTime);
    console.log('Current time:', currentTimeInUTCPlus7);
    const timeDifferenceInMinutes =
      (currentTimeInUTCPlus7 - messageTime) / (1000 * 60);

    // Kiểm tra xem đã quá 5 phút chưa
    if (timeDifferenceInMinutes > 5) {
      return {
        success: false,
        message: 'Message can only be updated within 5 minutes of sending',
      };
    }

    // Kiểm tra nội dung mới
    if (typeof new_content !== 'string' || new_content.trim() === '') {
      return {
        success: false,
        message: 'New content must be a non-empty string',
      };
    }

    // Cập nhật tin nhắn
    message.content = new_content;
    message.updatedAt = new Date();
    await message.save();

    return {
      success: true,
      message: 'Message updated successfully',
      updatedMessage: message,
    };
  } catch (error) {
    console.error('Error updating message:', error);
    return {
      success: false,
      message: 'An error occurred while updating the message',
    };
  }
};
exports.DeleteMessage = async (id, sender_id) => {
  try {
    // Tìm tin nhắn trước khi xóa để kiểm tra thời gian
    const message = await DirectMessage.findOne({
      where: {
        id: id,
        sender_id: sender_id,
      },
    });

    // Kiểm tra xem tin nhắn có tồn tại không
    if (!message) {
      return {
        success: false,
        message:
          'Message not found or you do not have permission to delete this message',
      };
    }

    // Tính thời gian từ lúc gửi tin nhắn
    const messageTime = new Date(message.sent_time);
    const currentTime = new Date();
    const timeDifferenceInMinutes = (currentTime - messageTime) / (1000 * 60);

    // Kiểm tra xem đã quá 5 phút chưa
    if (timeDifferenceInMinutes > 5) {
      return {
        success: false,
        message: 'Message can only be deleted within 5 minutes of sending',
      };
    }

    // Tiến hành xóa tin nhắn
    await message.destroy();

    return {
      success: true,
      message: 'Message deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting message:', error);
    return {
      success: false,
      message: 'An error occurred while deleting the message',
    };
  }
};
