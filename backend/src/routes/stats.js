const express = require('express');
const router = express.Router();

const statsController = require('../controllers/statsController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public dashboard statistics (for home page)
router.get('/dashboard', statsController.getDashboardStats);

// Protected dashboard statistics (admin/trainer only)
router.get('/admin/dashboard',
  authenticateToken,
  authorizeRoles('admin', 'trainer'),
  statsController.getDashboardStats
);

// Quiz statistics (admin/trainer only)
router.get('/quiz/:id',
  authenticateToken,
  authorizeRoles('admin', 'trainer'),
  statsController.getQuizStats
);

// User statistics (own stats or admin/trainer can view any)
router.get('/user/:id?', authenticateToken, statsController.getUserStats);

module.exports = router;
