// controllers/faqController.js
const FAQ = require("../Models/faqModel");

// GET all FAQs
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

// ADD a new FAQ
const addFAQ = async (req, res) => {
  const { question, answer } = req.body;

  try {
    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    res.status(201).json({ message: "FAQ added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add FAQ" });
  }
};

// UPDATE a FAQ
const updateFAQ = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  try {
    await FAQ.findByIdAndUpdate(id, { question, answer });
    res.json({ message: "FAQ updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update FAQ" });
  }
};

// DELETE a FAQ
const deleteFAQ = async (req, res) => {
  const { id } = req.params;

  try {
    await FAQ.findByIdAndDelete(id);
    res.json({ message: "FAQ deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
};

module.exports = { getFAQs, addFAQ, updateFAQ, deleteFAQ };
