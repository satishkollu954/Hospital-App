const express = require("express");
const router = express.Router();
const {
  addLocation,
  getAllLocations,
} = require("../controllers/locationController");

router.post("/locations", addLocation); // to add manually via Postman
router.get("/locations", getAllLocations); // fetch to show in UI

module.exports = router;
