/**
 * Hàm sinh OTP gồm đúng 6 chữ số
 * @returns {string} OTP ngẫu nhiên gồm 6 chữ số
 */
const generateOtp = () => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

module.exports = generateOtp;
