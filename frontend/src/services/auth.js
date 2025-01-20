import api from './api.js';

// Hàm đăng nhập
export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  const { accessToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  return response.data;
}

// Làm mới token
export async function refreshToken() {
  try {
    // Gửi yêu cầu POST mà không cần kèm refreshToken trong body
    const response = await api.post('/refresh', {}, { withCredentials: true });

    // Nhận accessToken mới và lưu vào localStorage
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);

    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

//kiểm tra tính hợp lệ của access token
export async function checkAccessToken(token) {
  try {
    const response = await api.post('/auth/verify', { token });
    return response.data;
    // console.log(response.data);
  } catch (error) {
    console.error('API error:', error);
    return { valid: false }; // Nếu có lỗi, coi như token không hợp lệ
  }
}
// Đăng xuất
export async function logOut() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }

    await api.post(
      '/auth/logout',
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem('accessToken');

    return { success: true, message: 'Đăng xuất thành công' };
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    // Vẫn xóa token local ngay cả khi API fails
    localStorage.removeItem('accessToken');
    throw error;
  }
}

export async function checkEmail(email) {
  try {
    const response = await api.post('/auth/check_email', { email });
    localStorage.setItem('otp_id', response.data.otp_id);
    return response.data.message;
  } catch (error) {
    return error.response.data.message;
  }
}

export default {
  login,
  logOut,
  checkAccessToken,
  checkEmail,
};
