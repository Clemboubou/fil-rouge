const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuizAttempt = sequelize.define('QuizAttempt', {
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
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id'
    }
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  timeTaken: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time taken in seconds'
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON object containing question IDs and selected answers'
  },
  percentage: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.totalQuestions > 0 ?
        Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0;
    }
  }
}, {
  tableName: 'quiz_attempts',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'quizId']
    },
    {
      fields: ['completedAt']
    }
  ]
});

module.exports = QuizAttempt;