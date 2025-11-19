const router = require('express').Router();
const auth = require('../middleware/auth');
const { getDashboardData } = require('../controllers/dashboardController');
router.get('/', auth, getDashboardData);
module.exports = router;