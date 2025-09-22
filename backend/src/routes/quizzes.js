const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quizController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { checkQuizCreationLimit } = require('../middleware/subscription');
const {
  validatePaginationQuery,
  validateQuizFiltersQuery,
  validateCreateQuiz,
  validateUpdateQuiz,
  validateCreateQuestion,
  validateUpdateQuestion,
  validateSubmitQuizAttempt
} = require('../middleware/validation');

// Public routes (with optional auth for personalization)
router.get('/', authenticateToken, validatePaginationQuery, validateQuizFiltersQuery, quizController.getAllQuizzes);

// Global leaderboard (must be before /:id route)
router.get('/leaderboard', authenticateToken, quizController.getGlobalLeaderboard);

router.get('/:id', authenticateToken, quizController.getQuizById);
router.get('/:id/questions', authenticateToken, quizController.getQuizQuestions);

// Protected routes - all users
router.post('/:id/attempts', authenticateToken, validateSubmitQuizAttempt, quizController.submitQuizAttempt);
router.post('/:id/submit', authenticateToken, validateSubmitQuizAttempt, quizController.submitQuizAttempt); // Alias for frontend compatibility
router.get('/attempts/my', authenticateToken, validatePaginationQuery, quizController.getUserQuizAttempts);

// Trainer and admin routes
router.post('/',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  checkQuizCreationLimit,
  validateCreateQuiz,
  quizController.createQuiz
);

router.put('/:id',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  validateUpdateQuiz,
  quizController.updateQuiz
);

router.delete('/:id',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  quizController.deleteQuiz
);

// Question management routes
router.post('/:id/questions',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  validateCreateQuestion,
  quizController.addQuestion
);

router.put('/:id/questions/:questionId',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  validateUpdateQuestion,
  quizController.updateQuestion
);

router.delete('/:id/questions/:questionId',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  quizController.deleteQuestion
);

// Quiz attempts management (for quiz creators)
router.get('/:id/attempts',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  validatePaginationQuery,
  quizController.getQuizAttempts
);

// Leaderboard routes
router.get('/:id/leaderboard', authenticateToken, quizController.getQuizLeaderboard);
router.get('/:id/stats', authenticateToken, authorizeRoles('trainer', 'admin'), quizController.getQuizStats);

module.exports = router;