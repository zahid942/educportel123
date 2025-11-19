// routes/resources.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const { getResources, addResource, deleteResource } = require('../controllers/resourceController');
router.get('/', auth, getResources);
router.post('/', auth, addResource);
router.delete('/:id', auth, deleteResource);
module.exports = router;