const nodemailer = require("nodemailer");
const otpverification = require("../Models/otpverifiaction");

const sendOTP = async (req, res) => {
  const { Email } = req.body;
  console.log("Email ", Email);
  const Otp = Math.floor(100000 + Math.random() * 900000);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "ashutosh.jena@raagvitech.com",
      pass: "qsmq ehnu maxg rzcs", // App password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Ashutosh Jena 👨‍💻" <ashutosh.jena@raagvitech.com>',
      to: Email,
      subject: "Hii from Ashutosh",
      text: `Your OTP is: ${Otp}`,
      html: `<p>Your OTP is: <b>${Otp}</b></p>`,
    });

    console.log("OTP email sent: %s", info.messageId);

    // 🔄 Update if email exists, insert if not
    await otpverification.findOneAndUpdate(
      { Email },
      { Otp },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: "OTP sent and stored successfully",
      otp: Otp, // ⚠️ remove in production
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OTP send or save failed" });
  }
};

module.exports = sendOTP;
