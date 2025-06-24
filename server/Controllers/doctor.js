const Doctor = require("../Models/Doctor");
const Staff = require("../Models/staffs");

//Adding doctors
// Add a new doctor
const addDoctors = async (req, res) => {
  try {
    const {
      Name,
      About,
      Email,
      Designation,
      Specialization,
      Age,
      State,
      City,
      From,
      To,
      Availability,
    } = req.body;

    const image = req.file?.filename || null;

    // 🔍 Check if email already exists in Doctor collection
    const doctorExists = await Doctor.findOne({ Email });
    if (doctorExists) {
      return res
        .status(400)
        .json({ message: "Doctor with this email already exists" });
    }

    // 🔍 Check if email already exists in Staff collection
    const staffExists = await Staff.findOne({ Email });
    if (staffExists) {
      return res
        .status(400)
        .json({ message: "Email already exists in staff records" });
    }

    // ✅ Create new doctor
    const newDoctor = new Doctor({
      image,
      Name,
      About,
      Email,
      Designation,
      Specialization,
      Age,
      State,
      City,
      From,
      To,
      Availability,
    });

    await newDoctor.save();

    // ✅ Add email to Staff collection (no password/otp)
    await Staff.create({ Email, Password: "", Otp: "" });

    res.status(201).json({ message: "Doctor added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Update the doctor
const updateDoctor = async (req, res) => {
  try {
    const { email } = req.params;

    // Use FormData values sent from frontend
    const updatedFields = {
      Name: req.body.Name,
      About: req.body.About,
      Designation: req.body.Designation,
      Specialization: req.body.Specialization,
      Age: req.body.Age,
      State: req.body.State,
      City: req.body.City,
      From: req.body.From,
      To: req.body.To,
      Availability:
        req.body.Availability === "true" || req.body.Availability === true,
    };

    // If image was uploaded, add it
    if (req.file?.filename) {
      updatedFields.image = req.file.filename;
    }

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { Email: email },
      updatedFields,
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res
      .status(200)
      .json({ message: "Doctor updated successfully", updatedDoctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { email } = req.params;

    const deletedDoctor = await Doctor.findOneAndDelete({ Email: email });

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const oneDoctor = async (req, res) => {
  try {
    const { email } = req.params;

    const doctor = await Doctor.findOne({ Email: email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch doctor", details: err.message });
  }
};

module.exports = {
  addDoctors,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  oneDoctor,
};
