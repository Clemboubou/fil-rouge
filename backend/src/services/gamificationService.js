const { User, Badge, UserBadge, UserStats, Quiz, QuizAttempt } = require('../models');
const { sequelize } = require('../config/database');

class GamificationService {

  // Initialiser les statistiques utilisateur
  static async initializeUserStats(userId) {
    try {
      const [userStats, created] = await UserStats.findOrCreate({
        where: { userId },
        defaults: {
          userId,
          level: 1,
          totalQuizzes: 0,
          totalPerfectScores: 0,
          currentStreak: 0,
          bestStreak: 0,
          averageTimePerQuestion: 0,
          categoryStats: {}
        }
      });
      return userStats;
    } catch (error) {
      console.error('Error initializing user stats:', error);
      throw error;
    }
  }

  // Calculer le niveau basé sur les points totaux
  static calculateLevel(totalPoints) {
    // Niveaux: 0-99 = 1, 100-299 = 2, 300-599 = 3, 600-999 = 4, 1000+ = 5, etc.
    if (totalPoints < 100) return 1;
    if (totalPoints < 300) return 2;
    if (totalPoints < 600) return 3;
    if (totalPoints < 1000) return 4;

    // Pour les niveaux élevés: chaque 500 points = +1 niveau
    return Math.floor((totalPoints - 1000) / 500) + 5;
  }

  // Points requis pour le prochain niveau
  static getPointsForNextLevel(currentLevel) {
    if (currentLevel === 1) return 100;
    if (currentLevel === 2) return 300;
    if (currentLevel === 3) return 600;
    if (currentLevel === 4) return 1000;

    // Pour les niveaux élevés
    return 1000 + ((currentLevel - 4) * 500);
  }

  // Mettre à jour les statistiques après un quiz
  static async updateUserStatsAfterQuiz(userId, quizAttempt, quiz) {
    const transaction = await sequelize.transaction();

    try {
      // Initialiser ou récupérer les stats
      let userStats = await UserStats.findOne({ where: { userId } });
      if (!userStats) {
        userStats = await this.initializeUserStats(userId);
      }

      const isPerfectScore = quizAttempt.correctAnswers === quizAttempt.totalQuestions;
      const avgTime = quizAttempt.timeTaken / quizAttempt.totalQuestions;

      // Mettre à jour les statistiques générales
      const updates = {
        totalQuizzes: userStats.totalQuizzes + 1,
        averageTimePerQuestion: ((userStats.averageTimePerQuestion * userStats.totalQuizzes) + avgTime) / (userStats.totalQuizzes + 1)
      };

      // Gestion des streaks
      if (isPerfectScore) {
        updates.totalPerfectScores = userStats.totalPerfectScores + 1;
        updates.currentStreak = userStats.currentStreak + 1;
        updates.bestStreak = Math.max(userStats.bestStreak, updates.currentStreak);
      } else {
        updates.currentStreak = 0;
      }

      // Statistiques par catégorie
      const categoryStats = userStats.categoryStats || {};
      const category = quiz.category;

      if (!categoryStats[category]) {
        categoryStats[category] = { completed: 0, perfect: 0 };
      }

      categoryStats[category].completed += 1;
      if (isPerfectScore) {
        categoryStats[category].perfect += 1;
      }

      updates.categoryStats = categoryStats;

      // Déterminer la catégorie favorite
      let favoriteCategory = null;
      let maxCompleted = 0;
      for (const [cat, stats] of Object.entries(categoryStats)) {
        if (stats.completed > maxCompleted) {
          maxCompleted = stats.completed;
          favoriteCategory = cat;
        }
      }
      updates.favoriteCategory = favoriteCategory;

      // Calculer le niveau basé sur les points totaux de l'utilisateur
      const user = await User.findByPk(userId);
      updates.level = this.calculateLevel(user.totalPoints);

      await userStats.update(updates, { transaction });
      await transaction.commit();

      return userStats;
    } catch (error) {
      await transaction.rollback();
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  // Vérifier et décerner des badges
  static async checkAndAwardBadges(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [
          { model: UserStats, as: 'stats' },
          { model: Badge, as: 'badges' }
        ]
      });

      if (!user || !user.stats) {
        return [];
      }

      const userBadgeIds = user.badges.map(badge => badge.id);
      const newBadges = [];

      // Récupérer tous les badges disponibles
      const allBadges = await Badge.findAll({ where: { isActive: true } });

      for (const badge of allBadges) {
        // Vérifier si l'utilisateur a déjà ce badge
        if (userBadgeIds.includes(badge.id)) {
          continue;
        }

        let shouldAward = false;

        switch (badge.condition) {
          case 'first_quiz':
            shouldAward = user.stats.totalQuizzes >= 1;
            break;

          case 'perfect_score':
            shouldAward = user.stats.totalPerfectScores >= 1;
            break;

          case 'speed_demon':
            shouldAward = user.stats.averageTimePerQuestion <= 10;
            break;

          case 'quiz_master':
            shouldAward = user.stats.totalQuizzes >= (badge.conditionValue || 10);
            break;

          case 'category_expert':
            if (badge.conditionCategory && user.stats.categoryStats[badge.conditionCategory]) {
              shouldAward = user.stats.categoryStats[badge.conditionCategory].perfect >= (badge.conditionValue || 5);
            }
            break;

          case 'streak_5':
            shouldAward = user.stats.bestStreak >= (badge.conditionValue || 5);
            break;

          case 'point_collector':
            shouldAward = user.totalPoints >= (badge.conditionValue || 1000);
            break;

          default:
            break;
        }

        if (shouldAward) {
          await UserBadge.create({
            userId,
            badgeId: badge.id,
            earnedAt: new Date(),
            notified: false
          });
          newBadges.push(badge);
        }
      }

      return newBadges;
    } catch (error) {
      console.error('Error checking badges:', error);
      throw error;
    }
  }

  // Obtenir le profil gamification d'un utilisateur
  static async getUserGamificationProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: UserStats,
            as: 'stats'
          },
          {
            model: Badge,
            as: 'badges',
            through: {
              attributes: ['earnedAt'],
              as: 'badgeInfo'
            }
          }
        ]
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Initialiser les stats si elles n'existent pas
      if (!user.stats) {
        await this.initializeUserStats(userId);
        return this.getUserGamificationProfile(userId);
      }

      const currentLevel = user.stats.level;
      const pointsForNext = this.getPointsForNextLevel(currentLevel);
      const progress = pointsForNext > 0 ? ((user.totalPoints % pointsForNext) / pointsForNext) * 100 : 100;

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          totalPoints: user.totalPoints,
          level: currentLevel,
          pointsForNextLevel: pointsForNext,
          progressToNextLevel: Math.round(progress)
        },
        stats: user.stats,
        badges: user.badges.map(badge => ({
          ...badge.toJSON(),
          earnedAt: badge.badgeInfo.earnedAt
        }))
      };
    } catch (error) {
      console.error('Error getting user gamification profile:', error);
      throw error;
    }
  }
}

module.exports = GamificationService;