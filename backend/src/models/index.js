const { sequelize } = require('../config/database');
const User = require('./User');
const Quiz = require('./Quiz');
const Question = require('./Question');
const QuizAttempt = require('./QuizAttempt');
const Badge = require('./Badge');
const UserBadge = require('./UserBadge');
const UserStats = require('./UserStats');
const Subscription = require('./Subscription');

// Define associations
User.hasMany(Quiz, {
  foreignKey: 'creatorId',
  as: 'createdQuizzes',
  onDelete: 'CASCADE'
});

Quiz.belongsTo(User, {
  foreignKey: 'creatorId',
  as: 'creator'
});

Quiz.hasMany(Question, {
  foreignKey: 'quizId',
  as: 'questions',
  onDelete: 'CASCADE'
});

Question.belongsTo(Quiz, {
  foreignKey: 'quizId',
  as: 'quiz'
});

User.hasMany(QuizAttempt, {
  foreignKey: 'userId',
  as: 'attempts',
  onDelete: 'CASCADE'
});

QuizAttempt.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Quiz.hasMany(QuizAttempt, {
  foreignKey: 'quizId',
  as: 'attempts',
  onDelete: 'CASCADE'
});

QuizAttempt.belongsTo(Quiz, {
  foreignKey: 'quizId',
  as: 'quiz'
});

// Badge associations
User.belongsToMany(Badge, {
  through: UserBadge,
  foreignKey: 'userId',
  as: 'badges'
});

Badge.belongsToMany(User, {
  through: UserBadge,
  foreignKey: 'badgeId',
  as: 'users'
});

UserBadge.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

UserBadge.belongsTo(Badge, {
  foreignKey: 'badgeId',
  as: 'badge'
});

// User stats associations
User.hasOne(UserStats, {
  foreignKey: 'userId',
  as: 'stats'
});

UserStats.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Subscription associations
User.hasOne(Subscription, {
  foreignKey: 'userId',
  as: 'subscription'
});

Subscription.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Quiz,
  Question,
  QuizAttempt,
  Badge,
  UserBadge,
  UserStats,
  Subscription,
  testConnection,
  syncDatabase
};