require('dotenv').config();
const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailUserPassword = process.env.EMAIL_USER_PASSWORD;
// Tạo cấu hình transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser, // Thay bằng địa chỉ email của bạn
    pass: emailUserPassword, // Thay bằng App Password từ Gmail
  },
});

// Cấu hình email cần gửi
const mailOptions = {
  from: emailUser, // Địa chỉ email của bạn
  to: 'kyanchanh266@gmail.com', // Địa chỉ email người nhận
  subject: 'Test Email 2222', // Chủ đề email
  html: `
    <html>
      <body>
        <h1 style="color: #4CAF50;">Hello!</h1>
        <p>This is a <strong>test email</strong> sent using Nodemailer.</p>
        <p>Here are some details:</p>
        <ul>
          <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
          <li><strong>Subject:</strong> Test Email</li>
        </ul>
        <p>Regards,</p>
        <p><em>Your Name</em></p>
      </body>
    </html>
  `, // Nội dung email dạng HTML
};

// Gửi email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});
