// routes/pages.js
const express = require('express');
const router = express.Router();

// Example static pages (customize as needed)
router.get('/about', (req, res) => {
  res.json({ success: true, message: 'About page content' });
});

router.get('/contact', (req, res) => {
  res.json({ success: true, message: 'Contact page content' });
});

module.exports = router;