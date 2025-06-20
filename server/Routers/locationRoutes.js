const express = require("express");
const router = express.Router();
const Doctor = require("../Models/Doctor");
const upload = require("../middlewares/upload");
const {
  addLocation,
  getAllLocations,
  getAllAppointment,
  DeleteAppointment,
  addDoctors,
  getAllDoctors,
} = require("../Controllers/locationController");

const { appointmentChange } = require("../Controllers/user");

router.post("/locations", addLocation); // to add manually via Postman
router.get("/locations", getAllLocations); // fetch to show in UI

// To Update status
router.patch("/appointments/:id", appointmentChange);
router.get("/appointments", getAllAppointment);
router.delete("/appointments/:id", DeleteAppointment);
router.post("/adddoctors", upload.single("image"), addDoctors);
router.get("/alldoctors", getAllDoctors);
module.exports = router;
