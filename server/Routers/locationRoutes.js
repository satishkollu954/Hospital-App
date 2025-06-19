const express = require("express");
const router = express.Router();
const {
  addLocation,
  getAllLocations,
  getAllAppointment,
} = require("../controllers/locationController");

const { appointmentChange } = require("../Controllers/user");

router.post("/locations", addLocation); // to add manually via Postman
router.get("/locations", getAllLocations); // fetch to show in UI

// To Update status
router.patch("/appointments/:id", appointmentChange);
router.get("/appointments", getAllAppointment);
module.exports = router;
