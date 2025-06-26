const Disease = require("../Models/Disease");

//  Add a new disease
exports.addDisease = async (req, res) => {
  try {
    const { disease, description, learnmore } = req.body;

    const newDisease = new Disease({ disease, description, learnmore });
    await newDisease.save();

    res.status(201).json({ success: true, message: "Disease added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add disease" });
  }
};

//  Get all diseases
exports.getDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find();
    res.status(200).json(diseases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch diseases" });
  }
};

//  Delete disease by ID
exports.deleteDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Disease.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Disease not found" });
    }

    res.status(200).json({ message: "Disease deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete disease" });
  }
};

// Update an existing disease by ID
exports.updateDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const { disease, description, learnmore } = req.body;

    const updated = await Disease.findByIdAndUpdate(
      id,
      { disease, description, learnmore },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Disease not found" });
    }

    res.status(200).json({ message: "Disease updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update disease" });
  }
};
