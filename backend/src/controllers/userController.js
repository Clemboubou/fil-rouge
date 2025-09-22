const { User, Quiz, QuizAttempt } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalUsers: count,
          hasNext: offset + users.length < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Quiz,
          as: 'createdQuizzes',
          attributes: ['id', 'title', 'description', 'isPublished', 'createdAt']
        },
        {
          model: QuizAttempt,
          as: 'attempts',
          attributes: ['id', 'score', 'completedAt'],
          include: [
            {
              model: Quiz,
              as: 'quiz',
              attributes: ['id', 'title']
            }
          ]
        }
      ]
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Get quiz attempts statistics
    const totalAttempts = await QuizAttempt.count({
      where: { userId }
    });

    const attempts = await QuizAttempt.findAll({
      where: { userId },
      attributes: ['score', 'correctAnswers', 'totalQuestions', 'completedAt'],
      order: [['completedAt', 'DESC']]
    });

    let averageScore = 0;
    let totalCorrectAnswers = 0;
    let totalQuestions = 0;

    if (attempts.length > 0) {
      const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
      averageScore = Math.round(totalScore / attempts.length);

      totalCorrectAnswers = attempts.reduce((sum, attempt) => sum + attempt.correctAnswers, 0);
      totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    }

    const averagePercentage = totalQuestions > 0 ?
      Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;

    // Get recent attempts
    const recentAttempts = attempts.slice(0, 5);

    // Get created quizzes count
    const createdQuizzesCount = await Quiz.count({
      where: { creatorId: userId }
    });

    const stats = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        totalPoints: user.totalPoints,
        createdAt: user.createdAt
      },
      quizStatistics: {
        totalAttempts,
        averageScore,
        averagePercentage,
        totalCorrectAnswers,
        totalQuestions,
        createdQuizzesCount
      },
      recentAttempts
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10, period = 'all' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { completedAt: { [Op.gte]: weekAgo } };
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { completedAt: { [Op.gte]: monthAgo } };
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFilter = { completedAt: { [Op.gte]: yearAgo } };
        break;
      default:
        // 'all' - no date filter
        break;
    }

    const users = await User.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'totalPoints',
        [
          require('sequelize').fn('COUNT', require('sequelize').col('attempts.id')),
          'totalAttempts'
        ],
        [
          require('sequelize').fn('AVG', require('sequelize').col('attempts.score')),
          'averageScore'
        ]
      ],
      include: [
        {
          model: QuizAttempt,
          as: 'attempts',
          attributes: [],
          where: dateFilter,
          required: false
        }
      ],
      where: { isActive: true },
      group: ['User.id'],
      order: [['totalPoints', 'DESC']],
      limit: parseInt(limit)
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      totalPoints: user.totalPoints,
      totalAttempts: parseInt(user.dataValues.totalAttempts) || 0,
      averageScore: Math.round(parseFloat(user.dataValues.averageScore) || 0)
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        period,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'trainer', 'admin'].includes(role)) {
      return next(new AppError('Invalid role specified', 400));
    }

    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.update({ role });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate user (admin only)
const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return next(new AppError('You cannot deactivate your own account', 400));
    }

    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.update({ isActive: false });

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Reactivate user (admin only)
const reactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.update({ isActive: true });

    res.json({
      success: true,
      message: 'User reactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get user's quiz attempts
const getUserAttempts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Users can only view their own attempts unless they're admin
    const userId = req.user.role === 'admin' ? id : req.user.id;

    const { count, rows: attempts } = await QuizAttempt.findAndCountAll({
      where: { userId },
      include: [{
        model: Quiz,
        attributes: ['id', 'title', 'category']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        attempts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserStats,
  getLeaderboard,
  updateUserRole,
  deactivateUser,
  reactivateUser,
  getUserAttempts
};