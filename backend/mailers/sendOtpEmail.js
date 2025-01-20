const transporter = require('../config/mailerConfig');
const fs = require('fs');

async function sendEmail(receivedEmail, subject, htmlContent, logoPath) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: receivedEmail,
    subject,
    html: htmlContent,
    attachments: [
      {
        filename: 'logo.png', // Tên file đính kèm
        path: logoPath, // Đường dẫn file
        cid: 'logo', // CID để sử dụng trong nội dung HTML (src="cid:logo")
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = sendEmail;
