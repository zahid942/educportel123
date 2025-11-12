const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Result = sequelize.define('Result', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER },
  subject: { type: DataTypes.STRING },
  marks: { type: DataTypes.INTEGER }
});

module.exports = Result;