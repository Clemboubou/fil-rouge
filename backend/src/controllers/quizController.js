const { Quiz, Question, User, QuizAttempt, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const GamificationService = require('../services/gamificationService');

// Get all quizzes with filters and pagination
const getAllQuizzes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      difficulty,
      published,
      creator,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};
    const conditions = [];

    if (category) {
      whereClause.category = category;
    }

    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    if (published !== undefined) {
      whereClause.isPublished = published === 'true';
    }

    if (creator) {
      whereClause.creatorId = creator;
    }

    // Non-trainers can only see published quizzes
    if (req.user.role === 'user') {
      whereClause.isPublished = true;
    }

    // Handle search separately to combine with other filters
    if (search) {
      const searchConditions = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };

      // If we have other filters, combine them with AND
      if (Object.keys(whereClause).length > 0) {
        conditions.push(whereClause);
        conditions.push(searchConditions);
      } else {
        Object.assign(whereClause, searchConditions);
      }
    }

    // Build final where clause
    const finalWhereClause = conditions.length > 0
      ? { [Op.and]: conditions }
      : whereClause;

    const { count, rows: quizzes } = await Quiz.findAndCountAll({
      where: finalWhereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Question,
          as: 'questions',
          attributes: ['id'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    // Add question count to each quiz
    const quizzesWithStats = quizzes.map(quiz => {
      const quizData = quiz.toJSON();
      quizData.questionCount = quiz.questions.length;
      delete quizData.questions;
      return quizData;
    });

    res.json({
      success: true,
      data: {
        quizzes: quizzesWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalQuizzes: count,
          hasNext: offset + quizzes.length < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get quiz by ID with questions
const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { includeAnswers } = req.query;

    const quiz = await Quiz.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Question,
          as: 'questions',
          attributes: includeAnswers === 'true' ?
            ['id', 'text', 'type', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'points', 'explanation', 'order'] :
            ['id', 'text', 'type', 'optionA', 'optionB', 'optionC', 'optionD', 'points', 'order'],
          order: [['order', 'ASC']]
        }
      ]
    });

    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    // Check permissions
    if (!quiz.isPublished && req.user.role === 'user' && quiz.creatorId !== req.user.id) {
      return next(new AppError('Access denied. Quiz is not published.', 403));
    }

    res.json({
      success: true,
      data: { quiz }
    });
  } catch (error) {
    next(error);
  }
};

// Create new quiz
const createQuiz = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, timeLimit, status } = req.body;
    const creatorId = req.user.id;

    // Map frontend difficulty values to backend values
    const difficultyMap = {
      'beginner': 'easy',
      'intermediate': 'medium',
      'advanced': 'hard'
    };
    const mappedDifficulty = difficultyMap[difficulty] || difficulty;

    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty: mappedDifficulty,
      timeLimit,
      creatorId,
      isPublished: status === 'published' ? true : false
    });

    // Increment quiz created count for trainers on free plan
    if (req.user.role === 'trainer' && req.user.plan === 'free') {
      await User.update(
        { quizCreatedCount: sequelize.literal('quizCreatedCount + 1') },
        { where: { id: req.user.id } }
      );
    }

    const createdQuiz = await Quiz.findByPk(quiz.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: { quiz: createdQuiz }
    });
  } catch (error) {
    next(error);
  }
};

// Update quiz
const updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty, timeLimit, isPublished } = req.body;

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    // Check permissions
    if (quiz.creatorId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Access denied. You can only edit your own quizzes.', 403));
    }

    await quiz.update({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      isPublished
    });

    const updatedQuiz = await Quiz.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      data: { quiz: updatedQuiz }
    });
  } catch (error) {
    next(error);
  }
};

// Delete quiz
const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    // Check permissions
    if (quiz.creatorId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Access denied. You can only delete your own quizzes.', 403));
    }

    await quiz.destroy();

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add question to quiz
const addQuestion = async (req, res, next) => {
  try {
    const { id: quizId } = req.params;
    const {
      text,
      type,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      points,
      explanation,
      order
    } = req.body;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    // Check permissions
    if (quiz.creatorId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Access denied. You can only add questions to your own quizzes.', 403));
    }

    // Get next order number if not provided
    let questionOrder = order;
    if (!questionOrder) {
      const lastQuestion = await Question.findOne({
        where: { quizId },
        order: [['order', 'DESC']]
      });
      questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
    }

    const question = await Question.create({
      quizId,
      text,
      type,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      points,
      explanation,
      order: questionOrder
    });

    // Update quiz totals
    await updateQuizTotals(quizId);

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: { question }
    });
  } catch (error) {
    next(error);
  }
};

// Update question
const updateQuestion = async (req, res, next) => {
  try {
    const { id: quizId, questionId } = req.params;
    const updateData = req.body;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    // Check permissions
    if (quiz.creatorId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Access denied. You can only edit questions in your own quizzes.', 403));
    }

    const question = await Question.findOne({
      where: { id: questionId, quizId }
    });

    if (!question) {
      return next(new AppError('Question not found', 404));
    }

    await question.update(updateData);

    // Update quiz totals if points changed
    if (updateData.points !== undefined) {
      await updateQuizTotals(quizId);
    }

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: { question }
    });
  } catch (error) {
    next(error);
  }
};

// Delete question
const deleteQuestion = async (req, res, next) => {
  try {
    const { id: quizId, questionId } = req.params;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    // Check permissions
    if (quiz.creatorId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Access denied. You can only delete questions from your own quizzes.', 403));
    }

    const question = await Question.findOne({
      where: { id: questionId, quizId }
    });

    if (!question) {
      return next(new AppError('Question not found', 404));
    }

    await question.destroy();

    // Update quiz totals
    await updateQuizTotals(quizId);

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Submit quiz attempt
const submitQuizAttempt = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id: quizId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: ['id', 'correctAnswer', 'points']
        }
      ]
    });

    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    if (!quiz.isPublished) {
      return next(new AppError('Quiz is not published', 400));
    }

    // Calculate score with difficulty weighting
    let score = 0;
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    // Points pondérés par difficulté
    const getDifficultyMultiplier = (difficulty) => {
      switch (difficulty) {
        case 'easy': return 1.0;    // 10 points -> 10 points
        case 'medium': return 1.5;  // 10 points -> 15 points
        case 'hard': return 2.0;    // 10 points -> 20 points
        default: return 1.0;
      }
    };

    // Calculer points bonus pour vitesse (bonus si réponse en moins de 15 secondes par question)
    const averageTimePerQuestion = timeTaken / totalQuestions;
    const speedBonus = averageTimePerQuestion < 15 ? 1.2 : 1.0; // 20% bonus vitesse

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        const basePoints = question.points;
        const difficultyMultiplier = getDifficultyMultiplier(quiz.difficulty);
        const questionScore = Math.round(basePoints * difficultyMultiplier * speedBonus);
        score += questionScore;
        correctAnswers++;
      }
    });

    // Bonus série : +50% si toutes les questions sont correctes
    if (correctAnswers === totalQuestions) {
      score = Math.round(score * 1.5);
    }

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      score,
      totalQuestions,
      correctAnswers,
      timeTaken,
      answers,
      completedAt: new Date()
    }, { transaction });

    // Update user total points
    await User.increment('totalPoints', {
      by: score,
      where: { id: userId },
      transaction
    });

    await transaction.commit();

    // Fetch the complete attempt with quiz info
    const completeAttempt = await QuizAttempt.findByPk(attempt.id, {
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'totalPoints']
        }
      ]
    });

    // Traitement gamification (après le commit pour éviter les blocages)
    try {
      // Mettre à jour les statistiques utilisateur
      await GamificationService.updateUserStatsAfterQuiz(userId, completeAttempt, quiz);

      // Vérifier et décerner de nouveaux badges
      const newBadges = await GamificationService.checkAndAwardBadges(userId);

      // Ajouter les nouveaux badges à la réponse
      completeAttempt.dataValues.newBadges = newBadges;

    } catch (gamificationError) {
      console.error('Gamification processing error:', gamificationError);
      // Ne pas faire échouer la soumission du quiz pour une erreur de gamification
    }

    res.status(201).json({
      success: true,
      message: 'Quiz attempt submitted successfully',
      data: { attempt: completeAttempt }
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Get quiz attempts for a quiz
const getQuizAttempts = async (req, res, next) => {
  try {
    const { id: quizId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    // Check permissions
    if (quiz.creatorId !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Access denied. You can only view attempts for your own quizzes.', 403));
    }

    const { count, rows: attempts } = await QuizAttempt.findAndCountAll({
      where: { quizId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['completedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        attempts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalAttempts: count,
          hasNext: offset + attempts.length < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's quiz attempts
const getUserQuizAttempts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    const { count, rows: attempts } = await QuizAttempt.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'description', 'category', 'difficulty']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['completedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        attempts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalAttempts: count,
          hasNext: offset + attempts.length < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update quiz totals
const updateQuizTotals = async (quizId) => {
  const questions = await Question.findAll({
    where: { quizId },
    attributes: ['points']
  });

  const totalQuestions = questions.length;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  await Quiz.update(
    { totalQuestions, totalPoints },
    { where: { id: quizId } }
  );
};

// Get quiz questions for taking quiz
const getQuizQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id, {
      include: [{
        model: Question,
        as: 'questions',
        attributes: ['id', 'text', 'type', 'optionA', 'optionB', 'optionC', 'optionD', 'points']
      }]
    });

    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    res.json({
      success: true,
      data: {
        quiz: {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit
        },
        questions: quiz.questions
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get quiz leaderboard
const getQuizLeaderboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    const leaderboard = await QuizAttempt.findAll({
      where: { quizId: id },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['score', 'DESC'], ['completedAt', 'ASC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: { leaderboard }
    });
  } catch (error) {
    next(error);
  }
};

// Get global leaderboard
const getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'totalPoints'],
      order: [['totalPoints', 'DESC']],
      limit: parseInt(limit),
      where: { isActive: true }
    });

    res.json({
      success: true,
      data: { leaderboard }
    });
  } catch (error) {
    next(error);
  }
};

// Get quiz statistics
const getQuizStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
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
    next(error);
  }
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  submitQuizAttempt,
  getQuizAttempts,
  getUserQuizAttempts,
  getQuizQuestions,
  getQuizLeaderboard,
  getGlobalLeaderboard,
  getQuizStats
};