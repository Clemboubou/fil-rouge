const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const GamificationService = require('../services/gamificationService');
const { Badge, UserBadge, UserStats, User, Quiz, QuizAttempt, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');

// Obtenir le profil gamification de l'utilisateur connecté
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const profile = await GamificationService.getUserGamificationProfile(req.user.id);
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
});

// Obtenir tous les badges disponibles
router.get('/badges', authenticateToken, async (req, res, next) => {
  try {
    const badges = await Badge.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { badges }
    });
  } catch (error) {
    next(error);
  }
});

// Obtenir les badges de l'utilisateur connecté
router.get('/my-badges', authenticateToken, async (req, res, next) => {
  try {
    const userBadges = await UserBadge.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Badge,
          as: 'badge',
          attributes: ['id', 'name', 'description', 'icon', 'condition']
        }
      ],
      order: [['earnedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { badges: userBadges }
    });
  } catch (error) {
    next(error);
  }
});

// Classement global (top 10)
router.get('/leaderboard/global', authenticateToken, async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'totalPoints'],
      include: [
        {
          model: UserStats,
          as: 'stats',
          attributes: ['level', 'totalQuizzes', 'totalPerfectScores']
        }
      ],
      order: [['totalPoints', 'DESC']],
      limit: parseInt(limit),
      where: { isActive: true }
    });

    // Ajouter la position dans le classement
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user.toJSON()
    }));

    res.json({
      success: true,
      data: { leaderboard: leaderboardWithRank }
    });
  } catch (error) {
    next(error);
  }
});

// Classement par catégorie
router.get('/leaderboard/category/:category', authenticateToken, async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    // Obtenir les utilisateurs avec des statistiques dans cette catégorie
    const userStats = await UserStats.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'totalPoints'],
          where: { isActive: true }
        }
      ],
      where: {
        categoryStats: {
          [category]: {
            completed: { $gt: 0 }
          }
        }
      },
      limit: parseInt(limit)
    });

    // Trier par nombre de quiz parfaits dans la catégorie, puis par total complété
    const sortedStats = userStats.sort((a, b) => {
      const aPerfect = a.categoryStats[category]?.perfect || 0;
      const bPerfect = b.categoryStats[category]?.perfect || 0;
      const aCompleted = a.categoryStats[category]?.completed || 0;
      const bCompleted = b.categoryStats[category]?.completed || 0;

      if (aPerfect !== bPerfect) {
        return bPerfect - aPerfect;
      }
      return bCompleted - aCompleted;
    });

    // Formatter la réponse
    const leaderboard = sortedStats.map((userStat, index) => ({
      rank: index + 1,
      user: userStat.user,
      categoryStats: userStat.categoryStats[category],
      level: userStat.level
    }));

    res.json({
      success: true,
      data: {
        category,
        leaderboard
      }
    });
  } catch (error) {
    next(error);
  }
});

// Statistiques générales de la plateforme
router.get('/platform-stats', authenticateToken, async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalQuizAttempts,
      totalBadgesEarned,
      averageScore
    ] = await Promise.all([
      User.count({ where: { isActive: true } }),
      QuizAttempt.count(),
      UserBadge.count(),
      QuizAttempt.findOne({
        attributes: [[sequelize.fn('AVG', sequelize.literal('(correctAnswers * 100.0 / totalQuestions)')), 'avgPercentage']]
      })
    ]);

    // Top 3 des catégories les plus populaires
    const quizzesByCategory = await Quiz.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('Quiz.id')), 'quizCount']
      ],
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('Quiz.id')), 'DESC']],
      limit: 3
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalQuizAttempts,
        totalBadgesEarned,
        averageScore: Math.round(averageScore?.dataValues?.avgPercentage || 0),
        topCategories: quizzesByCategory.map(cat => ({
          category: cat.category,
          quizCount: parseInt(cat.dataValues.quizCount)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Marquer les badges comme notifiés
router.post('/badges/mark-notified', authenticateToken, async (req, res, next) => {
  try {
    const { badgeIds } = req.body;

    if (!Array.isArray(badgeIds) || badgeIds.length === 0) {
      return next(new AppError('Badge IDs are required', 400));
    }

    await UserBadge.update(
      { notified: true },
      {
        where: {
          userId: req.user.id,
          badgeId: badgeIds,
          notified: false
        }
      }
    );

    res.json({
      success: true,
      message: 'Badges marked as notified'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;