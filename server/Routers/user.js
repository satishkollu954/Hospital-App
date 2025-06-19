const express = require("express");
const router = express.Router();

const { contactus, appointment } = require("../Controllers/user");

router.post("/contactus", (req, res) => {
  contactus(req, res);
});

router.post("/appointment", (req, res) => {
  appointment(req, res);
});

module.exports = router;
