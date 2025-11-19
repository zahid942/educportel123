// controllers/resourceController.js
const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: resources });
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch resources" });
  }
};

exports.addResource = async (req, res) => {
  try {
    const { title, link, description } = req.body;

    if (!title || !link) {
      return res.status(400).json({ success: false, message: "Title and link are required" });
    }

    const resource = await Resource.create({
      title,
      link,
      description: description || null
    });

    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    console.error("Add resource error:", error);
    res.status(500).json({ success: false, message: "Failed to add resource" });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Resource.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({ success: false, message: "Failed to delete resource" });
  }
};