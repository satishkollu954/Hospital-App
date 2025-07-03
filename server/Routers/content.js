const express = require("express");
const {
  createContent,
  getContent,
  updateContent,
  deleteContent,
} = require("../Controllers/content");

const router = express.Router();

router.post("/", createContent);
router.get("/", getContent);
router.put("/:id", updateContent);
router.delete("/:id", deleteContent);

module.exports = router;
