const { User, Quiz, QuizAttempt, Question } = require('../models');
const { Op } = require('sequelize');

// Get admin dashboard statistics
const getAdminStats = async (req, res, next) => {
  try {
    // Total users count
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const inactiveUsers = totalUsers - activeUsers;

    // Users by role
    const adminCount = await User.count({ where: { role: 'admin' } });
    const trainerCount = await User.count({ where: { role: 'trainer' } });
    const studentCount = await User.count({ where: { role: 'user' } });

    // Total quizzes
    const totalQuizzes = await Quiz.count();
    const publishedQuizzes = await Quiz.count({ where: { isPublished: true } });
    const draftQuizzes = await Quiz.count({ where: { isPublished: false } });

    // Total quiz attempts
    const totalAttempts = await QuizAttempt.count();
    const completedAttempts = totalAttempts; // All attempts are completed

    // Average scores
    const attemptsWithScores = await QuizAttempt.findAll({
      attributes: ['score']
    });
    const averageScore = attemptsWithScores.length > 0
      ? attemptsWithScores.reduce((sum, attempt) => sum + attempt.score, 0) / attemptsWithScores.length
      : 0;

    // Total questions
    const totalQuestions = await Question.count();

    // Recent users (last 5)
    const recentUsers = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'isActive']
    });

    // Recent quizzes (last 5)
    const recentQuizzes = await Quiz.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['firstName', 'lastName', 'email']
      }],
      attributes: ['id', 'title', 'category', 'difficulty', 'isPublished', 'createdAt']
    });

    // Recent attempts (last 10)
    const recentAttempts = await QuizAttempt.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['title']
        }
      ],
      attributes: ['id', 'score', 'createdAt', 'completedAt']
    });

    // Users registered in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersThisWeek = await User.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    // Quizzes created in last 7 days
    const newQuizzesThisWeek = await Quiz.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    // Attempts in last 7 days
    const attemptsThisWeek = await QuizAttempt.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          totalQuizzes,
          publishedQuizzes,
          draftQuizzes,
          totalAttempts,
          completedAttempts,
          totalQuestions,
          averageScore: Math.round(averageScore * 100) / 100
        },
        usersByRole: {
          admins: adminCount,
          trainers: trainerCount,
          students: studentCount
        },
        thisWeek: {
          newUsers: newUsersThisWeek,
          newQuizzes: newQuizzesThisWeek,
          attempts: attemptsThisWeek
        },
        recent: {
          users: recentUsers,
          quizzes: recentQuizzes,
          attempts: recentAttempts
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats
};