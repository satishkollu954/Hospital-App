const Disease = require("../Models/Disease");

// Create a new disease entry
exports.addDisease = async (req, res) => {
  try {
    const { disease, description } = req.body;

    const newDisease = new Disease({ disease, description });
    await newDisease.save();

    res.status(201).json({ success: true, message: "Disease added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add disease" });
  }
};

// Get all diseases
exports.getDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find();
    res.status(200).json(diseases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch diseases" });
  }
};
