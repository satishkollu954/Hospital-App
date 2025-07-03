const Staff = require("../Models/staffs");
const Doctor = require("../Models/Doctor");
const nodemailer = require("nodemailer");

// Helper: OTP generator
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// SEND OTP (Forgot Password)
exports.sendOtp = async (req, res) => {
  const { Email } = req.body;

  try {
    const staff = await Staff.findOne({ Email });
    if (!staff) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    staff.Otp = otp;
    await staff.save();

    // Send OTP email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ashutosh.jena@raagvitech.com",
        pass: "qsmq ehnu maxg rzcs", // App password
      },
    });

    await transporter.sendMail({
      from: '"Ashutosh Jena 👨‍💻" <ashutosh.jena@raagvitech.com>',
      to: Email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { Email, Otp } = req.body;

  try {
    const staff = await Staff.findOne({ Email });
    if (!staff) return res.status(404).json({ message: "User not found" });

    if (staff.Otp !== Otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: "Error verifying OTP" });
  }
};

// UPDATE PASSWORD USING OTP
exports.updatePassword = async (req, res) => {
  const { Email, Otp, newPassword } = req.body;

  try {
    // Find staff by email
    const staff = await Staff.findOne({ Email });
    if (!staff)
      return res.status(404).json({ message: "Staff user not found" });

    // Check OTP
    if (staff.Otp !== Otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Save plain text password (⚠️ not secure)
    staff.Password = newPassword;
    staff.Otp = null;
    await staff.save();

    // Also update Doctor's password if exists
    const doctor = await Doctor.findOne({ Email });
    if (doctor) {
      doctor.Password = newPassword;
      await doctor.save();
    }

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Password update failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const staff = await Staff.findOne({ Email });
    if (!staff) return res.status(404).json({ message: "User not found" });

    if (staff.Password != Password)
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.doctorsBasedOnCityAndDiseas = async (req, res) => {
  try {
    let { city, Specialization } = req.query;

    // 💡 Extract actual city from input if it contains a comma
    if (city && city.includes(",")) {
      const parts = city.split(",");
      city = parts[1].trim(); // Get the part after the comma
    }

    // 🔍 Build filter dynamically
    const filter = {};
    if (city) filter.City = city;
    if (Specialization) filter.Specialization = Specialization;

    console.log("filter", filter);

    const doctors = await Doctor.find(filter);
    console.log(doctors);

    if (doctors.length === 0) {
      return res
        .status(404)
        .json({ message: "No doctors found for given filters" });
    }

    res.status(200).json({ doctors });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};
