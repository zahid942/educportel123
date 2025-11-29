// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const url = process.env.DATABASE_URL;

console.log(
  'DATABASE_URL present?', !!url,
  '| sample:', url ? url.slice(0, 20) + '...' : url
);

if (!url) {
  throw new Error(
    'DATABASE_URL is NOT set. ' +
    'In Vercel, go to Project → Settings → Environment Variables and add DATABASE_URL for Production.'
  );
}

const sequelize = new Sequelize(url, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: { max: 3 },
});

sequelize.authenticate()
  .then(() => console.log('PostgreSQL connected'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

module.exports = sequelize;