// timeUtils.js

const VIETNAM_OFFSET = 7; // UTC+7
const EDIT_TIME_LIMIT = 5; // 5 phút

// Chuyển thời gian từ UTC+0 sang UTC+7
function toVNTime(date) {
  return new Date(date.getTime() + VIETNAM_OFFSET * 60 * 60 * 1000);
}

// Chuyển thời gian từ UTC+7 về UTC+0
function toUTCTime(vnTime) {
  return new Date(vnTime.getTime() - VIETNAM_OFFSET * 60 * 60 * 1000);
}

// Kiểm tra xem thời gian hiện tại có nằm trong khoảng cho phép edit không
function isWithinEditTimeLimit(messageTime) {
  const currentVNTime = toVNTime(new Date());
  const messageVNTime = toVNTime(messageTime);
  const diffInMinutes = (currentVNTime - messageVNTime) / (1000 * 60);
  return diffInMinutes <= EDIT_TIME_LIMIT;
}

// Lấy thời gian hiện tại ở múi giờ VN
function getCurrentVNTime() {
  return toVNTime(new Date());
}

// Format thời gian sang ISO string với timezone +7
function toVNISOString(date) {
  const vnTime = toVNTime(date);
  return vnTime.toISOString().replace('Z', '+07:00');
}

module.exports = {
  VIETNAM_OFFSET,
  EDIT_TIME_LIMIT,
  toVNTime,
  toUTCTime,
  isWithinEditTimeLimit,
  getCurrentVNTime,
  toVNISOString,
};
