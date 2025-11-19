// controllers/dashboardController.js
const User = require('../models/User');
const Resource = require('../models/Resource');
const SavedResult = require('../models/SavedResult'); // Fixed to use SavedResult
const Announcement = require('../models/Announcement');

exports.getDashboardData = async (req, res) => {
  try {
    const [userCount, resourceCount, resultCount, announcementCount, announcements] = await Promise.all([
      User.count(),
      Resource.count(),
      SavedResult.count(), // Fixed model reference
      Announcement.count(),
      Announcement.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5
      })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: userCount,
        totalResources: resourceCount,
        totalResults: resultCount,
        totalAnnouncements: announcementCount,
        recentAnnouncements: announcements
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data"
    });
  }
};