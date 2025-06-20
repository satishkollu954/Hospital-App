const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Invalid email format. Only @gmail.com addresses allowed.",
    ],
  },

  // ✅ new field
  contact: {
    type: String,
  },
  message: {
    type: String,
  },
});
const contactModel = mongoose.model("ContactUs", contactSchema);

module.exports = {
  contactModel,
};
