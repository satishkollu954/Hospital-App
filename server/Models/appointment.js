const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Invalid email format. Only @gmail.com addresses allowed.",
    ],
  },

  // ✅ new field
  phone: {
    type: String,
  },
  date: {
    type: Date,
  },
  reason: {
    type: String,
  },
});
const appointmentModel = mongoose.model("Appointments", appointmentSchema);

module.exports = {
  appointmentModel,
};
