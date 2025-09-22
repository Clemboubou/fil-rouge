const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id'
    }
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 1000]
    }
  },
  type: {
    type: DataTypes.ENUM('multiple_choice', 'true_false'),
    defaultValue: 'multiple_choice'
  },
  optionA: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  optionB: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  optionC: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  optionD: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  correctAnswer: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: 1,
      max: 100
    }
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'questions',
  timestamps: true
});

module.exports = Question;