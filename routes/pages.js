const router = require('express').Router();
const { about } = require('../controllers/pagesController');
router.get('/about', about);
module.exports = router;