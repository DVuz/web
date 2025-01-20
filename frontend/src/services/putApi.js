import api from './api';

/**
 * Hàm gọi API dùng chung cho phương thức PUT
 * @param {string} endpoint - Endpoint API
 * @param {object} data - Dữ liệu gửi lên
 * @param {string} accessToken - Token xác thực (optional)
 * @returns {Promise<any>} - Trả về dữ liệu từ API hoặc ném lỗi
 */
export const putApi = async (endpoint, data, accessToken = null) => {
  try {
    const config = {};

    if (accessToken) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }

    const response = await api.put(endpoint, data, config);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'API Error');
    }
  } catch (error) {
    console.error(`API PUT Error [${endpoint}]:`, error.message);
    throw error;
  }
};

/**
 * Hàm cập nhật tin nhắn
 * @param {number} messageId - ID của tin nhắn cần cập nhật
 * @param {object} messageData - Dữ liệu tin nhắn cần cập nhật
 * @param {string} accessToken - Token xác thực
 * @returns {Promise<any>} - Trả về dữ liệu tin nhắn đã cập nhật
 */
export const updateMessage = (messageId, messageData, accessToken) => {
  return putApi(
    `/messages/update_message/${messageId}`,
    messageData,
    accessToken
  );
};

// Có thể thêm các hàm PUT khác ở đây khi cần thiết
