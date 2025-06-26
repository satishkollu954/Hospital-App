const HospitalLocation = require("../Models/HospitalLocation");
const { appointmentModel } = require("../Models/appointment");

// Save location data manually
const addLocation = async (req, res) => {
  try {
    const { State, branches } = req.body;

    // Check if the State already exists
    const existingState = await HospitalLocation.findOne({ State });

    if (existingState) {
      let added = false;

      // Add only new branches (by name)
      branches.forEach((newBranch) => {
        const exists = existingState.branches.some(
          (b) => b.name === newBranch.name
        );
        if (!exists) {
          existingState.branches.push(newBranch);
          added = true;
        }
      });

      if (added) {
        await existingState.save();
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
    const newLocation = new HospitalLocation({ State, branches });
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

// fetching all Appointments
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
// Get All Appointments Of a Doctor By Docotor Email
const getAppointmentsByDoctorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const appointments = await appointmentModel
      .find({ doctorEmail: email })
      .sort({ date: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments for doctor:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an Appointment
const DeleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await appointmentModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
};

// Get list of States and their branch names (cities)
const getAllStates = async (req, res) => {
  try {
    const states = await HospitalLocation.find().select("State -_id");
    const uniqueStates = [...new Set(states.map((loc) => loc.State))];
    res.status(200).json(uniqueStates);
  } catch (err) {
    console.error("Error fetching states:", err);
    res.status(500).json({ message: "Failed to fetch states" });
  }
};

const getCitiesByState = async (req, res) => {
  try {
    const { state } = req.query;

    const location = await HospitalLocation.findOne({ State: state });

    if (!location) {
      return res.status(404).json({ message: "State not found" });
    }

    const citys = location.branches.map((b) => b.name);
    res.status(200).json(citys);
  } catch (err) {
    console.error("Error fetching cities:", err);
    res.status(500).json({ message: "Failed to fetch cities" });
  }
};

//Update a  Branch Based on State
// Update a branch by branchId
const updateBranchDetails = async (req, res) => {
  try {
    const { state, branchId, newName, newMapUrl } = req.body;

    const location = await HospitalLocation.findOneAndUpdate(
      { State: state, "branches._id": branchId },
      {
        $set: {
          "branches.$.name": newName,
          "branches.$.mapUrl": newMapUrl,
        },
      },
      { new: true }
    );

    if (!location) {
      return res.status(404).json({ message: "Branch or state not found" });
    }

    res.status(200).json({ message: "Branch updated successfully", location });
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).json({ message: "Failed to update branch" });
  }
};

//Delete a  Branch in a State
// Delete a branch by branchId
const deleteBranch = async (req, res) => {
  try {
    const { state, branchId } = req.body;

    const location = await HospitalLocation.findOneAndUpdate(
      { State: state },
      { $pull: { branches: { _id: branchId } } },
      { new: true }
    );

    if (!location) {
      return res.status(404).json({ message: "State or branch not found" });
    }

    res.status(200).json({ message: "Branch deleted successfully", location });
  } catch (error) {
    console.error("Error deleting branch:", error);
    res.status(500).json({ message: "Failed to delete branch" });
  }
};

//Delete a State with Branch
const deleteState = async (req, res) => {
  try {
    const { state } = req.params;

    const deleted = await HospitalLocation.findOneAndDelete({ State: state });
    if (!deleted) {
      return res.status(404).json({ message: "State not found" });
    }

    res
      .status(200)
      .json({ message: "State and all branches deleted successfully" });
  } catch (err) {
    console.error("Error deleting state:", err);
    res.status(500).json({ message: "Failed to delete state" });
  }
};

module.exports = {
  addLocation,
  getAllLocations,
  getAllAppointment,
  DeleteAppointment,
  getAllStates,
  getCitiesByState,
  deleteState,
  deleteBranch,
  updateBranchDetails,
  getAppointmentsByDoctorEmail,
};
