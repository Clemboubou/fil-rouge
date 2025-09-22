const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validatePaginationQuery } = require('../middleware/validation');
const { validate, schemas } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Public user routes (authenticated users)
router.get('/leaderboard', validatePaginationQuery, userController.getLeaderboard);
router.get('/stats/:id?', userController.getUserStats);
router.get('/:id/attempts', userController.getUserAttempts);

// Admin only routes
router.get('/',
  authorizeRoles('admin'),
  validatePaginationQuery,
  userController.getAllUsers
);

router.get('/:id',
  authorizeRoles('admin'),
  userController.getUserById
);

router.put('/:id/role',
  authorizeRoles('admin'),
  validate(schemas.updateUserRole || require('joi').object({
    role: require('joi').string().valid('user', 'trainer', 'admin').required()
  })),
  userController.updateUserRole
);

router.put('/:id/deactivate',
  authorizeRoles('admin'),
  userController.deactivateUser
);

router.put('/:id/reactivate',
  authorizeRoles('admin'),
  userController.reactivateUser
);

module.exports = router;