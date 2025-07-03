const Content = require("../Models/content");
const translate = require("@vitalets/google-translate-api");
// Create
const createContent = async (req, res) => {
  try {
    const newContent = new Content(req.body);
    const saved = await newContent.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read
const getContent = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const content = await Content.findOne();
    if (!content) {
      return res.status(404).json({ message: "No content found" });
    }

    // If lang is "en", return as-is
    if (lang === "en") {
      return res.status(200).json(content);
    }

    // Helper: recursively translate object fields
    const translateContent = async (data) => {
      if (typeof data === "string") {
        const translated = await translate(data, { to: lang });
        return translated.text;
      } else if (typeof data === "object" && data !== null) {
        const entries = await Promise.all(
          Object.entries(data).map(async ([key, value]) => {
            return [key, await translateContent(value)];
          })
        );
        return Object.fromEntries(entries);
      } else {
        return data;
      }
    };

    const translated = await translateContent(content.toObject());
    return res.status(200).json(translated);
  } catch (error) {
    console.error("Translation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update
const updateContent = async (req, res) => {
  try {
    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
const deleteContent = async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Export all functions using CommonJS
module.exports = {
  createContent,
  getContent,
  updateContent,
  deleteContent,
};
