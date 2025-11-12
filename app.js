const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/results', require('./routes/results'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/pages', require('./routes/pages'));

sequelize.sync().then(() => console.log('✅ Tables synced'));

module.exports = app;