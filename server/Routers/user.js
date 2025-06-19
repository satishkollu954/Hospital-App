const express = require("express");
const router = express.Router();

const { contactus } = require("../Controllers/user");

router.post("/contactus", (req, res) => {
  contactus(req, res);
});

module.exports = router;
