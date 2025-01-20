// FormatLastLogin.js

/**
 * Hàm tính toán và định dạng thời gian online trước đó.
 *
 * @param {string} lastLogin - Thời gian đăng nhập của người dùng (dạng chuỗi).
 * @returns {string} - Chuỗi mô tả thời gian (ví dụ: "X phút trước", "X giờ trước", "Vừa xong").
 */
const formatLastLogin = (lastLogin) => {
  const now = new Date(); // Lấy thời gian hiện tại
  const loginTime = new Date(lastLogin); // Chuyển đổi thời gian login từ chuỗi (UTC) thành đối tượng Date
  const diffInMs = now - loginTime; // Tính toán sự khác biệt giữa thời gian hiện tại và thời gian login

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Chuyển đổi sự khác biệt từ milliseconds sang phút
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // Chuyển đổi sự khác biệt từ milliseconds sang giờ
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Chuyển đổi sự khác biệt từ milliseconds sang ngày

  // Nếu đã hơn 1 ngày, không hiển thị gì
  if (diffInDays >= 1) {
    return ''; // Trả về chuỗi rỗng nếu sự khác biệt lớn hơn hoặc bằng 1 ngày
  }

  // Nếu đã qua 1 giờ, hiển thị số giờ
  if (diffInHours >= 1) {
    return `${diffInHours} giờ trước`; // Trả về thời gian theo giờ
  }

  // Nếu đã qua 1 phút, hiển thị số phút
  if (diffInMinutes >= 1) {
    return `${diffInMinutes} phút trước`; // Trả về thời gian theo phút
  }

  return 'Vừa xong'; // Nếu thời gian nhỏ hơn 1 phút, hiển thị "Vừa xong"
};

export default formatLastLogin; // Export hàm để có thể sử dụng ở các file khác
