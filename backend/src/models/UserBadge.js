const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserBadge = sequelize.define('UserBadge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  badgeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'badges',
      key: 'id'
    }
  },
  earnedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si l\'utilisateur a été notifié du nouveau badge'
  }
}, {
  tableName: 'user_badges',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'badgeId']
    }
  ]
});

module.exports = UserBadge;