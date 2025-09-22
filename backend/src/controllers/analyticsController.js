const { Quiz, Question, User, QuizAttempt, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

// Analytics pour un quiz spécifique (formateur)
const getQuizAnalytics = async (req, res, next) => {
  try {
    const { id: quizId } = req.params;

    // Vérifier que le quiz existe et que l'utilisateur en est le créateur
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    if (quiz.creatorId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Access denied. You can only view analytics for your own quizzes.', 403));
    }

    // Statistiques générales du quiz
    const [
      totalAttempts,
      avgScore,
      avgPercentage,
      avgTime,
      completionRate
    ] = await Promise.all([
      QuizAttempt.count({ where: { quizId } }),
      QuizAttempt.findOne({
        where: { quizId },
        attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'averageScore']]
      }),
      QuizAttempt.findOne({
        where: { quizId },
        attributes: [[sequelize.fn('AVG', sequelize.literal('(correctAnswers * 100.0 / totalQuestions)')), 'averagePercentage']]
      }),
      QuizAttempt.findOne({
        where: { quizId },
        attributes: [[sequelize.fn('AVG', sequelize.col('timeTaken')), 'averageTime']]
      }),
      QuizAttempt.findOne({
        where: {
          quizId,
          [Op.and]: sequelize.where(
            sequelize.literal('(correctAnswers * 100.0 / totalQuestions)'),
            { [Op.gte]: 70 }
          )
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'passedAttempts']]
      })
    ]);

    // Distribution des scores par tranches
    const scoreDistribution = await QuizAttempt.findAll({
      where: { quizId },
      attributes: [
        [
          sequelize.literal(`
            CASE
              WHEN (correctAnswers * 100.0 / totalQuestions) >= 90 THEN '90-100%'
              WHEN (correctAnswers * 100.0 / totalQuestions) >= 80 THEN '80-89%'
              WHEN (correctAnswers * 100.0 / totalQuestions) >= 70 THEN '70-79%'
              WHEN (correctAnswers * 100.0 / totalQuestions) >= 60 THEN '60-69%'
              WHEN (correctAnswers * 100.0 / totalQuestions) >= 50 THEN '50-59%'
              ELSE '0-49%'
            END
          `),
          'scoreRange'
        ],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['scoreRange'],
      order: [[sequelize.literal('count'), 'DESC']]
    });

    // Analyse par question (taux de réussite par question)
    const questions = await Question.findAll({
      where: { quizId },
      attributes: ['id', 'text', 'correctAnswer', 'points'],
      order: [['order', 'ASC']]
    });

    const questionAnalytics = [];

    for (const question of questions) {
      const attempts = await QuizAttempt.findAll({
        where: { quizId },
        attributes: ['answers']
      });

      let correctCount = 0;
      let totalResponses = 0;

      attempts.forEach(attempt => {
        if (attempt.answers && attempt.answers[question.id]) {
          totalResponses++;
          if (attempt.answers[question.id] === question.correctAnswer) {
            correctCount++;
          }
        }
      });

      const successRate = totalResponses > 0 ? Math.round((correctCount / totalResponses) * 100) : 0;

      questionAnalytics.push({
        questionId: question.id,
        questionText: question.text.substring(0, 100) + '...',
        points: question.points,
        totalResponses,
        correctResponses: correctCount,
        successRate,
        difficulty: successRate >= 80 ? 'easy' : successRate >= 60 ? 'medium' : 'hard'
      });
    }

    // Top 5 des meilleurs scores
    const topScores = await QuizAttempt.findAll({
      where: { quizId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      attributes: ['id', 'score', 'percentage', 'timeTaken', 'completedAt'],
      order: [[sequelize.literal('(correctAnswers * 100.0 / totalQuestions)'), 'DESC'], ['timeTaken', 'ASC']],
      limit: 5
    });

    // Évolution dans le temps (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyAttempts = await QuizAttempt.findAll({
      where: {
        quizId,
        completedAt: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('completedAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'attempts'],
        [sequelize.fn('AVG', sequelize.literal('(correctAnswers * 100.0 / totalQuestions)')), 'avgScore']
      ],
      group: [sequelize.fn('DATE', sequelize.col('completedAt'))],
      order: [['date', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        quiz: {
          id: quiz.id,
          title: quiz.title,
          category: quiz.category,
          difficulty: quiz.difficulty,
          totalQuestions: quiz.totalQuestions
        },
        overview: {
          totalAttempts,
          averageScore: Math.round(avgScore?.dataValues?.averageScore || 0),
          averagePercentage: Math.round(avgPercentage?.dataValues?.averagePercentage || 0),
          averageTime: Math.round(avgTime?.dataValues?.averageTime || 0),
          completionRate: totalAttempts > 0 ? Math.round((completionRate?.dataValues?.passedAttempts || 0) / totalAttempts * 100) : 0
        },
        scoreDistribution: scoreDistribution.map(item => ({
          range: item.dataValues.scoreRange,
          count: parseInt(item.dataValues.count)
        })),
        questionAnalytics: questionAnalytics.sort((a, b) => a.successRate - b.successRate),
        topScores: topScores.map(attempt => ({
          user: attempt.user,
          score: attempt.score,
          percentage: attempt.percentage,
          timeTaken: attempt.timeTaken,
          completedAt: attempt.completedAt
        })),
        dailyTrend: dailyAttempts.map(day => ({
          date: day.dataValues.date,
          attempts: parseInt(day.dataValues.attempts),
          averageScore: Math.round(day.dataValues.avgScore || 0)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Analytics globales pour un formateur
const getTrainerAnalytics = async (req, res, next) => {
  try {
    const trainerId = req.user.id;

    // Récupérer tous les quiz du formateur
    const trainerQuizzes = await Quiz.findAll({
      where: { creatorId: trainerId },
      attributes: ['id', 'title', 'category', 'totalQuestions', 'createdAt']
    });

    const quizIds = trainerQuizzes.map(quiz => quiz.id);

    if (quizIds.length === 0) {
      return res.json({
        success: true,
        data: {
          overview: {
            totalQuizzes: 0,
            totalAttempts: 0,
            totalStudents: 0,
            averageScore: 0
          },
          quizzes: [],
          categoryBreakdown: [],
          recentActivity: []
        }
      });
    }

    // Statistiques générales
    const [
      totalAttempts,
      uniqueStudents,
      avgScore
    ] = await Promise.all([
      QuizAttempt.count({ where: { quizId: quizIds } }),
      QuizAttempt.findAll({
        where: { quizId: quizIds },
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('userId')), 'uniqueUsers']],
        group: ['userId']
      }),
      QuizAttempt.findOne({
        where: { quizId: quizIds },
        attributes: [[sequelize.fn('AVG', sequelize.literal('(correctAnswers * 100.0 / totalQuestions)')), 'averageScore']]
      })
    ]);

    // Performance par quiz
    const quizPerformance = await Promise.all(
      trainerQuizzes.map(async quiz => {
        const [attempts, avgQuizScore] = await Promise.all([
          QuizAttempt.count({ where: { quizId: quiz.id } }),
          QuizAttempt.findOne({
            where: { quizId: quiz.id },
            attributes: [[sequelize.fn('AVG', sequelize.literal('(correctAnswers * 100.0 / totalQuestions)')), 'averageScore']]
          })
        ]);

        return {
          id: quiz.id,
          title: quiz.title,
          category: quiz.category,
          totalQuestions: quiz.totalQuestions,
          attempts,
          averageScore: Math.round(avgQuizScore?.dataValues?.averageScore || 0),
          createdAt: quiz.createdAt
        };
      })
    );

    // Répartition par catégorie
    const categoryBreakdown = await Quiz.findAll({
      where: { creatorId: trainerId },
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quizCount']
      ],
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    // Activité récente (derniers 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await QuizAttempt.findAll({
      where: {
        quizId: quizIds,
        completedAt: { [Op.gte]: sevenDaysAgo }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title']
        }
      ],
      attributes: ['id', 'score', 'percentage', 'timeTaken', 'completedAt'],
      order: [['completedAt', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalQuizzes: trainerQuizzes.length,
          totalAttempts,
          totalStudents: uniqueStudents.length,
          averageScore: Math.round(avgScore?.dataValues?.averageScore || 0)
        },
        quizzes: quizPerformance.sort((a, b) => b.attempts - a.attempts),
        categoryBreakdown: categoryBreakdown.map(cat => ({
          category: cat.category,
          count: parseInt(cat.dataValues.quizCount)
        })),
        recentActivity: recentActivity.map(attempt => ({
          user: attempt.user,
          quiz: attempt.quiz,
          score: attempt.score,
          percentage: attempt.percentage,
          timeTaken: attempt.timeTaken,
          completedAt: attempt.completedAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Rapport détaillé d'un étudiant pour un formateur
const getStudentReport = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const trainerId = req.user.id;

    // Vérifier que l'étudiant existe
    const student = await User.findByPk(studentId, {
      attributes: ['id', 'firstName', 'lastName', 'email']
    });

    if (!student) {
      return next(new AppError('Student not found', 404));
    }

    // Récupérer les quiz du formateur
    const trainerQuizzes = await Quiz.findAll({
      where: { creatorId: trainerId },
      attributes: ['id', 'title', 'category', 'difficulty']
    });

    const quizIds = trainerQuizzes.map(quiz => quiz.id);

    // Récupérer toutes les tentatives de l'étudiant sur les quiz du formateur
    const studentAttempts = await QuizAttempt.findAll({
      where: {
        userId: studentId,
        quizId: quizIds
      },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'category', 'difficulty', 'totalQuestions']
        }
      ],
      attributes: ['id', 'score', 'percentage', 'timeTaken', 'completedAt', 'correctAnswers'],
      order: [['completedAt', 'DESC']]
    });

    // Statistiques générales de l'étudiant
    const totalAttempts = studentAttempts.length;
    const averageScore = totalAttempts > 0
      ? Math.round(studentAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts)
      : 0;

    const averageTime = totalAttempts > 0
      ? Math.round(studentAttempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0) / totalAttempts)
      : 0;

    // Performance par catégorie
    const categoryPerformance = {};
    studentAttempts.forEach(attempt => {
      const category = attempt.quiz.category;
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = {
          attempts: 0,
          totalScore: 0,
          averageScore: 0
        };
      }
      categoryPerformance[category].attempts++;
      categoryPerformance[category].totalScore += attempt.percentage;
      categoryPerformance[category].averageScore = Math.round(
        categoryPerformance[category].totalScore / categoryPerformance[category].attempts
      );
    });

    // Évolution dans le temps
    const progressData = studentAttempts
      .slice(0, 10) // Dernières 10 tentatives
      .reverse()
      .map((attempt, index) => ({
        attemptNumber: index + 1,
        quizTitle: attempt.quiz.title,
        score: attempt.percentage,
        date: attempt.completedAt
      }));

    res.json({
      success: true,
      data: {
        student,
        overview: {
          totalAttempts,
          averageScore,
          averageTime,
          quizzesCompleted: new Set(studentAttempts.map(a => a.quiz.id)).size,
          totalQuizzesAvailable: trainerQuizzes.length
        },
        categoryPerformance: Object.entries(categoryPerformance).map(([category, stats]) => ({
          category,
          ...stats
        })),
        recentAttempts: studentAttempts.slice(0, 5).map(attempt => ({
          quiz: attempt.quiz,
          score: attempt.score,
          percentage: attempt.percentage,
          timeTaken: attempt.timeTaken,
          completedAt: attempt.completedAt
        })),
        progressData
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizAnalytics,
  getTrainerAnalytics,
  getStudentReport
};