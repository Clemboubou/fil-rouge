const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const {
  getQuizAnalytics,
  getTrainerAnalytics,
  getStudentReport
} = require('../controllers/analyticsController');

// Analytics pour un quiz spécifique (créateur du quiz uniquement)
router.get('/quiz/:id',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  getQuizAnalytics
);

// Analytics globales du formateur
router.get('/trainer',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  getTrainerAnalytics
);

// Rapport détaillé d'un étudiant (formateur uniquement)
router.get('/student/:studentId',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  getStudentReport
);

module.exports = router;