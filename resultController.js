// controllers/resultController.js
const SavedResult = require('../models/SavedResult'); // Fixed to use SavedResult instead of non-existent Result

exports.getUserResults = async (req, res) => {
  try {
    const results = await SavedResult.findAll({ where: { userId: req.user.id } });
    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Get user results error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch results" });
  }
};

exports.addResult = async (req, res) => {
  try {
    const { university, rollno, examYear, semester, program, label } = req.body;
    if (!university || !rollno || !examYear || !semester) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const result = await SavedResult.create({
      userId: req.user.id,
      university,
      rollno,
      examYear,
      semester,
      program,
      label,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Add result error:", error);
    res.status(500).json({ success: false, message: "Failed to add result" });
  }
};