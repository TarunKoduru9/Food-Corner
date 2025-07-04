const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"RR Food Corner" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<p>Your OTP code is: <b>${otp}</b></p><p>It will expire in 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
