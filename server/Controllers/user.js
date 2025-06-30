const { contactModel } = require("../Models/contactus");
const { appointmentModel } = require("../Models/appointment");
const Staff = require("../Models/staffs");
const Doctor = require("../Models/Doctor");
const sendEmail = require("./email");
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

// Delete a contact query by ID
const deleteQuery = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await contactModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Query not found" });
    }

    res.status(200).json({ message: "Query deleted successfully" });
  } catch (err) {
    console.error("Error deleting query:", err);
    res.status(500).json({ message: "Failed to delete query" });
  }
};

// Adding Appointments
const appointment = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      date,
      time, // 👈 New field for slot time
      reason,
      disease,
      state,
      city,
      doctor,
    } = req.body;

    // Parse and validate the date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    const formattedDate = new Date(parsedDate.toISOString().split("T")[0]);

    // Find doctor by name
    const foundDoctor = await Doctor.findOne({ Name: doctor });
    if (!foundDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    // Create new appointment document
    const newAppointment = new appointmentModel({
      fullName,
      email,
      phone,
      date: formattedDate,
      time, // 👈 Store time string (like "11:00")
      reason,
      disease,
      state,
      city,
      doctor,
      doctorEmail: foundDoctor.Email,
      status: "Pending", // default or custom
    });

    // Save to database
    await newAppointment.save();

    await sendEmail(
      email,
      "Appointment Confirmation - RaagviCare",
      `
  <div style="
    font-family: Arial, sans-serif;
    background: url('https://cdn.pixabay.com/photo/2016/03/31/20/11/doctor-1295581_1280.png') no-repeat center;
    background-size: cover;
    padding: 40px;
    color: #ffffff;
    text-shadow: 1px 1px 2px #000;
    border-radius: 12px;
  ">
    <div style="background-color: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 10px;">
      <h2 style="color: #4fd1c5;">Hello ${fullName},</h2>

      <p style="font-size: 16px;">
        Thank you for scheduling your appointment with us! Below are your appointment details:
      </p>
      <ul style="line-height: 1.8; font-size: 16px;">
        <li><strong>Doctor:</strong> Dr. ${doctor}</li>
        <li><strong>Date:</strong> ${formattedDate.toDateString()}</li>
        <li><strong>Slot Time:</strong> ${time}</li>
        <li><strong>Status:</strong> <span style="color: #ffc107;">Pending</span></li>
      </ul>

      <p>
        Please arrive 10-15 minutes early and carry any necessary documents. If you need assistance, our team is just a call away.
      </p>

      <p style="font-style: italic;">We're here to care for you every step of the way.</p>

      <br />
      <p>Warm regards,<br/><strong>RaagviCare Team</strong></p>
    </div>
  </div>
  `
    );

    console.log("✅ Appointment saved");
    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    console.error("❌ Error saving appointment:", error);
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
    // 1. Find the appointment by ID
    const appointment = await appointmentModel.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 2. Update the status
    appointment.status = status;
    await appointment.save();
    console.log("Appointment status ", status);
    // 3. Send email ONLY if status is "Completed"
    if (status == "Completed") {
      const { fullName, email, doctor, date } = appointment;
      const formattedDate = new Date(date).toLocaleDateString();
      console.log("email in appointmentchange ", email);
      await sendEmail(
        email,
        "Thank You for Visiting - RaagviCare",
        `
        <div style="
          font-family: Arial, sans-serif;
          background: url('https://cdn.pixabay.com/photo/2017/08/06/00/04/medical-2585039_1280.jpg') no-repeat center;
          background-size: cover;
          padding: 40px;
          color: #ffffff;
          text-shadow: 1px 1px 2px #000;
          border-radius: 12px;
        ">
          <div style="background-color: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 10px;">
            <h2 style="color: #4fd1c5;">Hello ${fullName},</h2>
            <p style="font-size: 16px;">
              Your appointment with <strong>Dr. ${doctor}</strong> on <strong>${formattedDate}</strong> has been successfully completed.
            </p>
            <p>We truly appreciate your trust in our care.</p>
            <p style="font-weight: bold;">Thank you for visiting RaagviCare. We hope to serve you again!</p>
            <br />
            <p>Warm regards,<br/><strong>HospitalCare Team</strong></p>
          </div>
        </div>
        `
      );
    }

    // 4. Respond with success
    res.json({ message: "Status updated successfully." });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

module.exports = {
  contactus,
  appointment,
  login,
  appointmentChange,
  AllQueries,
  deleteQuery,
};
