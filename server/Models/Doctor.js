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
  WorkingLocation: String,
  Availability: {
    from: String, // e.g., "10:00 AM"
    to: String, // e.g., "06:00 PM"
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
