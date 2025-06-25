const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  image: String,
  Name: String,
  About: String,
  Email: String,
  Password: String,
  Designation: String,
  Specialization: String,
  Age: Number,
  State: String,
  City: String,
  Availability: Boolean,
  From: String, // e.g., "10:00 AM"
  To: String, // e.g., "06:00 PM"
  Learnmore: String,
});

module.exports = mongoose.model("Doctor", doctorSchema);
