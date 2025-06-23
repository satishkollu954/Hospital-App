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
      WorkingLocation,
      AvailabilityFrom,
      AvailabilityTo,
    } = req.body;

    const image = req.file?.filename || null;

    const newDoctor = new Doctor({
      image,
      Name,
      About,
      Email,
      Designation,
      Specialization,
      Age,
      WorkingLocation,
      Availability: {
        from: AvailabilityFrom,
        to: AvailabilityTo,
      },
    });

    await newDoctor.save();

    const existingStaff = await Staff.findOne({ Email });

    if (!existingStaff) {
      await Staff.create({ Email });
    }
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
    const {
      Name,
      About,
      Designation,
      Specialization,
      Age,
      WorkingLocation,
      AvailabilityFrom,
      AvailabilityTo,
    } = req.body;

    const updatedFields = {
      Name,
      About,
      Designation,
      Specialization,
      Age,
      WorkingLocation,
      Availability: {
        from: AvailabilityFrom,
        to: AvailabilityTo,
      },
    };

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

module.exports = {
  addDoctors,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
};
