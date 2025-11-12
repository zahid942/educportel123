const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
  const resources = await Resource.findAll();
  res.json(resources);
};

exports.addResource = async (req, res) => {
  const { title, link, description } = req.body;
  const resource = await Resource.create({ title, link, description });
  res.json(resource);
};

exports.deleteResource = async (req, res) => {
  await Resource.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Deleted successfully' });
};