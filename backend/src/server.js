const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection, syncDatabase } = require('./models');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { specs, swaggerUi, swaggerConfig } = require('./config/swagger');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quizzes');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'QuizMaster API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/subscription', require('./routes/subscription'));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerConfig));

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to QuizMaster API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get user profile (requires auth)',
        'PUT /api/auth/profile': 'Update user profile (requires auth)',
        'PUT /api/auth/change-password': 'Change password (requires auth)',
        'POST /api/auth/refresh-token': 'Refresh JWT token (requires auth)'
      },
      users: {
        'GET /api/users': 'Get all users (admin only)',
        'GET /api/users/:id': 'Get user by ID (admin only)',
        'GET /api/users/stats/:id?': 'Get user statistics',
        'GET /api/users/leaderboard': 'Get leaderboard',
        'PUT /api/users/:id/role': 'Update user role (admin only)',
        'PUT /api/users/:id/deactivate': 'Deactivate user (admin only)',
        'PUT /api/users/:id/reactivate': 'Reactivate user (admin only)'
      },
      quizzes: {
        'GET /api/quizzes': 'Get all quizzes with filters',
        'GET /api/quizzes/:id': 'Get quiz by ID with questions',
        'POST /api/quizzes': 'Create new quiz (trainer/admin only)',
        'PUT /api/quizzes/:id': 'Update quiz (creator/admin only)',
        'DELETE /api/quizzes/:id': 'Delete quiz (creator/admin only)',
        'POST /api/quizzes/:id/questions': 'Add question to quiz (creator/admin only)',
        'PUT /api/quizzes/:id/questions/:questionId': 'Update question (creator/admin only)',
        'DELETE /api/quizzes/:id/questions/:questionId': 'Delete question (creator/admin only)',
        'POST /api/quizzes/:id/attempts': 'Submit quiz attempt (requires auth)',
        'GET /api/quizzes/:id/attempts': 'Get quiz attempts (creator/admin only)',
        'GET /api/quizzes/attempts/my': 'Get user\'s quiz attempts (requires auth)'
      }
    },
    documentation: 'For detailed API documentation, please refer to the README.md file'
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    console.log('HTTP server closed.');

    // Close database connection
    require('./config/database').sequelize.close()
      .then(() => {
        console.log('Database connection closed.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error closing database connection:', err);
        process.exit(1);
      });
  });

  // Force close server after 30 seconds
  setTimeout(() => {
    console.log('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Handle process termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
let server;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models
    await syncDatabase();

    // Start HTTP server
    server = app.listen(PORT, () => {
      console.log(`🚀 QuizMaster API server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api`);

      if (process.env.NODE_ENV === 'development') {
        console.log('\n📋 Available endpoints:');
        console.log('   Authentication: http://localhost:' + PORT + '/api/auth');
        console.log('   Users: http://localhost:' + PORT + '/api/users');
        console.log('   Quizzes: http://localhost:' + PORT + '/api/quizzes');
      }
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;