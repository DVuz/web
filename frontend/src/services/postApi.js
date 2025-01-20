import api from './api';

/**
 * Creates form data from message content and files
 */
const createMessageFormData = (messageData, files) => {
  const formData = new FormData();

  // Add basic message data
  formData.append('conversation_id', messageData.conversation_id);
  formData.append('sender_id', messageData.sender_id);
  formData.append('type', messageData.type);

  if (messageData.content) {
    formData.append('content', messageData.content);
  }

  if (messageData.parent_id) {
    formData.append('parent_id', messageData.parent_id);
  }

  // Add files if present
  if (files && files.length > 0) {
    files.forEach((fileObj) => {
      formData.append('files', fileObj.file);
    });
  }

  return formData;
};

/**
 * Send message with optional file attachments
 * @param {Object} messageData - Message data (conversation_id, sender_id, content, type, parent_id)
 * @param {Array} files - Array of file objects to upload
 * @param {string} accessToken - Authentication token
 * @returns {Promise} API response
 */
export const sendMessage = async (messageData, files = [], accessToken) => {
  try {
    if (!messageData.conversation_id || !messageData.sender_id) {
      throw new Error('Missing required fields: conversation_id and sender_id');
    }

    // Create form data with message content and files
    const formData = createMessageFormData(messageData, files);

    // Set up request config with proper headers for file upload
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await api.post(
      '/messages/create_new_message',
      formData,
      config
    );

    if (response.data.success) {
      return {
        success: true,
        data: response.data.message,
        files: response.data.files,
      };
    } else {
      throw new Error(response.data.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Send message error:', error);
    throw {
      success: false,
      message: error.message || 'Failed to send message',
      error,
    };
  }
};

/**
 * Upload files separately (if needed)
 * @param {Array} files - Array of files to upload
 * @param {string} accessToken - Authentication token
 * @returns {Promise} Array of uploaded file URLs
 */
export const uploadFiles = async (files, accessToken) => {
  try {
    const formData = new FormData();
    files.forEach((fileObj) => {
      formData.append('files', fileObj.file);
    });

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await api.post('/upload', formData, config);

    if (response.data.success) {
      return response.data.files;
    } else {
      throw new Error(response.data.message || 'File upload failed');
    }
  } catch (error) {
    console.error('File upload error:', error);
    throw {
      success: false,
      message: 'File upload failed',
      error,
    };
  }
};
