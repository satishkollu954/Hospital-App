const express = require("express");
const router = express.Router();
const Doctor = require("../Models/Doctor");
const sendOTP = require("../Controllers/sendotp");
const upload = require("../middlewares/upload");
const verifyOTP = require("../Controllers/verifyOTP");
const {
  addLocation,
  getAllLocations,
  getAllAppointment,
  DeleteAppointment,
  getCitiesByState,
  getAllStates,
} = require("../Controllers/locationController");
const { addDoctors, getAllDoctors } = require("../Controllers/doctor");

const { appointmentChange, AllQueries } = require("../Controllers/user");

router.post("/locations", addLocation); // to add manually via Postman
router.get("/locations", getAllLocations); // fetch to show in UI

// To Update status
router.patch("/appointments/:id", appointmentChange);
router.get("/appointments", getAllAppointment);
router.delete("/appointments/:id", DeleteAppointment);
router.post("/adddoctors", upload.single("image"), addDoctors);
router.get("/alldoctors", getAllDoctors);
router.get("/Allqueries", AllQueries);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/states", getAllStates);
router.get("/cities", getCitiesByState);

module.exports = router;
