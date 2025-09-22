const { Quiz, User, QuizAttempt, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [totalQuizzes, totalUsers, totalAttempts, recentAttempts] = await Promise.all([
      Quiz.count(),
      User.count(),
      QuizAttempt.count(),
      QuizAttempt.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: Quiz, as: 'quiz', attributes: ['id', 'title'] }
        ]
      })
    ]);

    // Calculate average score
    const avgScore = await QuizAttempt.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('score')), 'averageScore']
      ]
    });

    res.json({
      success: true,
      data: {
        totalQuizzes,
        totalUsers,
        totalAttempts,
        averageScore: parseFloat(avgScore?.dataValues?.averageScore || 0).toFixed(2),
        recentAttempts
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get quiz-specific statistics
const getQuizStats = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const [totalAttempts, avgScore, bestScore, worstScore] = await Promise.all([
      QuizAttempt.count({ where: { quizId: id } }),
      QuizAttempt.findOne({
        where: { quizId: id },
        attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'averageScore']]
      }),
      QuizAttempt.max('score', { where: { quizId: id } }),
      QuizAttempt.min('score', { where: { quizId: id } })
    ]);

    res.json({
      success: true,
      data: {
        quiz: {
          id: quiz.id,
          title: quiz.title
        },
        totalAttempts,
        averageScore: parseFloat(avgScore?.dataValues?.averageScore || 0).toFixed(2),
        bestScore: bestScore || 0,
        worstScore: worstScore || 0
      }
    });
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz statistics'
    });
  }
};

// Get user-specific statistics
const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = id || req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const [totalAttempts, avgScore, bestScore, recentAttempts] = await Promise.all([
      QuizAttempt.count({ where: { userId } }),
      QuizAttempt.findOne({
        where: { userId },
        attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'averageScore']]
      }),
      QuizAttempt.max('score', { where: { userId } }),
      QuizAttempt.findAll({
        where: { userId },
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{ model: Quiz, as: 'quiz', attributes: ['id', 'title'] }]
      })
    ]);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username
        },
        totalAttempts,
        averageScore: parseFloat(avgScore?.dataValues?.averageScore || 0).toFixed(2),
        bestScore: bestScore || 0,
        recentAttempts
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
};

module.exports = {
  getDashboardStats,
  getQuizStats,
  getUserStats
};
