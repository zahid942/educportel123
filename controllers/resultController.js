const Result = require('../models/Result');

exports.getUserResults = async (req, res) => {
  const results = await Result.findAll({ where: { userId: req.user.id } });
  res.json(results);
};

exports.addResult = async (req, res) => {
  const { subject, marks } = req.body;
  const result = await Result.create({ userId: req.user.id, subject, marks });
  res.json(result);
};