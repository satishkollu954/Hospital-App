const { contactModel } = require("../Models/contactus");
const { appointmentModel } = require("../Models/appointment");

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

const appointment = async (req, res) => {
  try {
    const { fullName, email, phone, date, reason } = req.body;

    // Convert MM/DD/YYYY to Date object
    const parsedDate = new Date(date); // "06/21/2025" ➝ Date object
    const formattedDate = new Date(parsedDate).toISOString().split("T")[0];
    console.log("formattedDate", formattedDate);
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

    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    console.error("Error saving appointment:", error);
    if (error.code === 11000 && error.keyValue?.email) {
      res
        .status(409)
        .json({ message: "Email already used for an appointment." });
    } else {
      res
        .status(500)
        .json({ message: "Server error while booking appointment." });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "admin123") {
    return res.json({ success: true });
  }
  return res.json({ success: false, message: "Invalid credentials" });
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

module.exports = { contactus, appointment, login, appointmentChange };
