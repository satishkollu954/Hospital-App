const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  image: String,
  Name: String,
  About: String,
});

module.exports = mongoose.model("Doctor", doctorSchema);
