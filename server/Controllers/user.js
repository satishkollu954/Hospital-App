const { contactModel } = require("../Models/contactus");
const { appointmentModel } = require("../Models/appointment");
const Staff = require("../Models/staffs");
// inserting new queries
const contactus = async (req, res) => {
  try {
    console.log("Received contact form data:", req.body);

    const { fullName, email, contact, message } = req.body;

    // Create a new document
    const newContact = new contactModel({
      fullName,
      email,
      contact,
      message,
    });

    // Save to database
    await newContact.save();

    res.status(201).json({ message: "Contact form submitted successfully." });
  } catch (error) {
    console.error("Error saving contact form:", error);

    if (error.code === 11000 && error.keyValue?.email) {
      res.status(409).json({ message: "Email already exists." });
    } else {
      res.status(500).json({ message: "Server error while saving contact." });
    }
  }
};

// fetching all the contact queries
const AllQueries = async (req, res) => {
  try {
    const queries = await contactModel.find();
    console.log(queries);
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Adding Appointments
const appointment = async (req, res) => {
  try {
    const { fullName, email, phone, date, reason } = req.body;

    const parsedDate = new Date(date);
    const formattedDate = new Date(parsedDate).toISOString().split("T")[0];

    if (isNaN(parsedDate)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use MM/DD/YYYY." });
    }

    const newAppointment = new appointmentModel({
      fullName,
      email,
      phone,
      date: formattedDate,
      reason,
    });

    await newAppointment.save();
    console.log("Appointment saved");
    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    console.error("Error saving appointment:", error);
    res
      .status(500)
      .json({ message: "Server error while booking appointment." });
  }
};

//This is used for Admin Log in
const login = async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Check if admin login
  // if (email === "admin@gmail.com" && password === "admin123") {
  //   return res.json({ success: true, role: "admin" });
  // }

  try {
    // Step 2: Find staff user
    const staff = await Staff.findOne({ Email: email });

    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Step 3: Compare password directly (plain text)
    if (staff.Password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Step 4: Success
    return res.json({ success: true, role: "staff" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//To Update the appointment status
const appointmentChange = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await appointmentModel.findByIdAndUpdate(id, { status });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

module.exports = {
  contactus,
  appointment,
  login,
  appointmentChange,
  AllQueries,
};
