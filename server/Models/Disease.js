const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema({
  disease: String,
  description: String,
});

module.exports = mongoose.model("Disease", diseaseSchema);
