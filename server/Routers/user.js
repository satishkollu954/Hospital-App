const express = require("express");
const router = express.Router();

const { services } = require("../Controllers/user");

router.get("/services", (req, res) => {
  services(req, res);
});

module.exports = router;
