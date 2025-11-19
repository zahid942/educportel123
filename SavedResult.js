// models/SavedResult.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const SavedResult = sequelize.define('SavedResult', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  university: {
    type: DataTypes.STRING(10), // 'pu', 'bzu', 'gcuf'
    allowNull: false,
  },
  rollno: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  examYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  program: {
    type: DataTypes.STRING(100), // e.g., "BS Computer Science"
    allowNull: true,
  },
  label: {
    type: DataTypes.STRING(100), // e.g., "Fall 2023 - 5th Sem"
    allowNull: true,
  },
  lastFetchedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'university', 'rollno', 'examYear', 'semester']
    },
    { fields: ['university'] },
    { fields: ['rollno'] }
  ]
});

// Relationships
User.hasMany(SavedResult, { foreignKey: 'userId', onDelete: 'CASCADE' });
SavedResult.belongsTo(User, { foreignKey: 'userId' });

module.exports = SavedResult;