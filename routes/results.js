const router = require('express').Router();
const auth = require('../middleware/auth');
const { getUserResults, addResult } = require('../controllers/resultController');
router.get('/', auth, getUserResults);
router.post('/', auth, addResult);
module.exports = router;