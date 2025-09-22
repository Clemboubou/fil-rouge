const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '🏆'
  },
  condition: {
    type: DataTypes.ENUM(
      'first_quiz',          // Premier quiz terminé
      'perfect_score',       // Score parfait (100%)
      'speed_demon',         // Quiz terminé en moins de 10 secondes par question
      'quiz_master',         // 10 quiz terminés
      'category_expert',     // 5 quiz parfaits dans une même catégorie
      'streak_5',           // 5 quiz parfaits consécutifs
      'point_collector'     // 1000 points totaux
    ),
    allowNull: false
  },
  conditionValue: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Valeur seuil pour débloquer le badge (ex: 1000 points, 5 quiz, etc.)'
  },
  conditionCategory: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Catégorie spécifique pour les badges category_expert'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'badges',
  timestamps: true
});

module.exports = Badge;