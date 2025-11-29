// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

let url = process.env.DATABASE_URL;

console.log('RAW DATABASE_URL value:', JSON.stringify(url));

if (!url) {
  throw new Error(
    'DATABASE_URL is NOT set. ' +
    'In Vercel, go to Project → Settings → Environment Variables and add DATABASE_URL for Production.'
  );
}

url = url.trim();

// Strip wrapping quotes if they accidentally exist
if (
  (url.startsWith('"') && url.endsWith('"')) ||
  (url.startsWith("'") && url.endsWith("'"))
) {
  url = url.slice(1, -1);
}

// Neon often gives `postgresql://` – normalize to `postgres://`
if (url.startsWith('postgresql://')) {
  url = 'postgres://' + url.slice('postgresql://'.length);
}

console.log(
  'Normalized DATABASE_URL (hidden creds):',
  url.replace(/:\/\/.*@/, '://***@')
);

// Parse into parts
const dbUrl = new URL(url);

const sequelize = new Sequelize(
  dbUrl.pathname.slice(1),        // database name (without leading '/')
  dbUrl.username,                 // user
  dbUrl.password,                 // password
  {
    host: dbUrl.hostname,
    port: dbUrl.port || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: { max: 3 },
  }
);

sequelize.authenticate()
  .then(() => console.log('PostgreSQL connected'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

module.exports = sequelize;