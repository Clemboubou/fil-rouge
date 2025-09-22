const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserStats = sequelize.define('UserStats', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: { min: 1 }
  },
  totalQuizzes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  totalPerfectScores: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  currentStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 },
    comment: 'Quiz parfaits consécutifs actuels'
  },
  bestStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 },
    comment: 'Meilleure série de quiz parfaits'
  },
  averageTimePerQuestion: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0 },
    comment: 'Temps moyen par question en secondes'
  },
  favoriteCategory: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Catégorie avec le plus de quiz réussis'
  },
  categoryStats: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Statistiques par catégorie {Programming: {completed: 5, perfect: 2}, ...}'
  }
}, {
  tableName: 'user_stats',
  timestamps: true
});

module.exports = UserStats;