const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: 'Internal server error',
    status: 500
  };

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    error.message = 'Validation failed';
    error.status = 400;
    error.errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    error.message = 'Resource already exists';
    error.status = 409;
    error.errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error.message = 'Invalid reference to related resource';
    error.status = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.status = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.status = 401;
  }

  // Custom app errors
  if (err.isOperational) {
    error.message = err.message;
    error.status = err.statusCode || 500;
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && error.status === 500) {
    error.message = 'Something went wrong';
  }

  res.status(error.status).json(error);
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  AppError,
  notFound
};