const directMessageService = require('../services/directMessageService');
exports.getMessagesBetweenUsers = async (req, res) => {
  const { sender_id, receiver_id } = req.body;
  try {
    const result = await directMessageService.GetRecentMessagesBetweenUsers(
      sender_id,
      receiver_id
    );
    if (result.success) {
      res.status(200).json(result.messages);
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createMessage = async (req, res) => {
  const { sender_id, receiver_id, content, type } = req.body;

  try {
    // Gọi service để tạo tin nhắn mới
    const result = await directMessageService.CreateNewMessage(
      sender_id,
      receiver_id,
      content,
      type
    );

    // Kiểm tra kết quả từ service
    if (result.success) {
      res.status(201).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.searchMessagesController = async (req, res) => {
  const { sender_id, receiver_id, searchTerm } = req.body; // Nhận thông tin từ body của request
  try {
    const result = await directMessageService.searchMessages(
      sender_id,
      receiver_id,
      searchTerm
    ); // Gọi hàm tìm kiếm
    if (result.success) {
      // Trả về các tin nhắn tìm thấy và số lượng
      res
        .status(200)
        .json({ messages: result.messages, length: result.length });
    } else {
      res.status(404).json({ message: result.message }); // Trả về thông báo lỗi
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi server
  }
};
exports.getMessagesMediaBetweenUsers = async (req, res) => {
  const { sender_id, receiver_id } = req.body;
  try {
    const result = await directMessageService.GetRecentMessagesWithMedia(
      sender_id,
      receiver_id
    );
    if (result.success) {
      res.status(200).json(result.messages);
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMessage = async (req, res) => {
  const { id, sender_id, new_content } = req.body;

  try {
    const result = await directMessageService.UpdateMessage(
      id,
      sender_id,
      new_content
    );

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id, sender_id } = req.body;

  try {
    const result = await directMessageService.DeleteMessage(id, sender_id);

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
