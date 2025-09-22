const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [3, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'),
    defaultValue: 'medium'
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time limit in minutes'
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'quizzes',
  timestamps: true
});

module.exports = Quiz;