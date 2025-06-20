const HospitalLocation = require("../Models/HospitalLocation");
const { appointmentModel } = require("../Models/appointment");
const Doctor = require("../Models/Doctor");
// Save location data manually
const addLocation = async (req, res) => {
  try {
    const { city, branches } = req.body;

    // Check if the city already exists
    const existingCity = await HospitalLocation.findOne({ city });

    if (existingCity) {
      let added = false;

      // Add only new branches (by name)
      branches.forEach((newBranch) => {
        const exists = existingCity.branches.some(
          (b) => b.name === newBranch.name
        );
        if (!exists) {
          existingCity.branches.push(newBranch);
          added = true;
        }
      });

      if (added) {
        await existingCity.save();
        return res.status(200).json({
          message: "New branches added to existing city.",
        });
      } else {
        return res.status(200).json({
          message: "No new branches added. All branches already exist.",
        });
      }
    }

    // City doesn't exist, create new
    const newLocation = new HospitalLocation({ city, branches });
    await newLocation.save();

    res.status(201).json({ message: "City and branches added successfully." });
  } catch (err) {
    console.error("Error saving location:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all locations
const getAllLocations = async (req, res) => {
  console.log("Fetch the location ");
  try {
    const locations = await HospitalLocation.find();
    console.log(locations);
    res.status(200).json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find().sort({ date: -1 }); // optional sort
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching appointments" });
  }
};

const addDoctors = async (req, res) => {
  try {
    const { Name, About } = req.body;
    const image = req.file.filename;

    const newDoctor = new Doctor({ image, Name, About });
    await newDoctor.save();
    res.status(201).json({ message: "Doctor added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addLocation,
  getAllLocations,
  getAllAppointment,
  addDoctors,
  getAllDoctors,
};
