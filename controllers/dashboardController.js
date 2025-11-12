const User = require('../models/User');
const Resource = require('../models/Resource');
const Result = require('../models/Result');
const Announcement = require('../models/Announcement');

exports.getDashboardData = async (req, res) => {
  const [users, resources, results, announcements] = await Promise.all([
    User.count(),
    Resource.count(),
    Result.count(),
    Announcement.findAll()
  ]);

  res.json({ users, resources, results, announcements });
};