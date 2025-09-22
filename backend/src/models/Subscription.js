const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
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
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  stripePriceId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  plan: {
    type: DataTypes.ENUM('free', 'premium'),
    allowNull: false,
    defaultValue: 'free'
  },
  status: {
    type: DataTypes.ENUM('active', 'canceled', 'past_due', 'unpaid', 'trialing'),
    allowNull: false,
    defaultValue: 'active'
  },
  currentPeriodStart: {
    type: DataTypes.DATE,
    allowNull: true
  },
  currentPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trialEnd: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelAtPeriodEnd: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'subscriptions',
  timestamps: true
});

module.exports = Subscription;