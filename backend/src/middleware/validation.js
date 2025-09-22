const Joi = require('joi');

// Generic validation middleware
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails
      });
    }

    req[property] = value;
    next();
  };
};

// Validation schemas
const schemas = {
  // User schemas
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(100).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 100 characters',
      'any.required': 'Password is required'
    }),
    username: Joi.string().min(2).max(100).messages({
      'string.min': 'Username must be at least 2 characters long',
      'string.max': 'Username cannot exceed 100 characters'
    }),
    firstName: Joi.string().min(2).max(100).messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 100 characters'
    }),
    lastName: Joi.string().min(2).max(100).messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 100 characters'
    }),
    role: Joi.string().valid('user', 'trainer', 'student', 'admin').default('user'),
    confirmPassword: Joi.string().allow(''),
    agreeToTerms: Joi.boolean().allow('')
  }).or('username', 'firstName'),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(100),
    lastName: Joi.string().min(2).max(100),
    email: Joi.string().email()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).max(100).required().messages({
      'string.min': 'New password must be at least 6 characters long',
      'string.max': 'New password cannot exceed 100 characters',
      'any.required': 'New password is required'
    })
  }),

  // Quiz schemas
  createQuiz: Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
      'string.min': 'Quiz title must be at least 3 characters long',
      'string.max': 'Quiz title cannot exceed 255 characters',
      'any.required': 'Quiz title is required'
    }),
    description: Joi.string().max(2000).allow(''),
    category: Joi.string().max(100).allow(''),
    difficulty: Joi.string().valid('easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced').default('medium'),
    timeLimit: Joi.number().integer().min(1).max(300).allow(null),
    status: Joi.string().valid('draft', 'published').allow(''),
    createdBy: Joi.number().integer().allow(''),
    questions: Joi.array().allow('')
  }),

  updateQuiz: Joi.object({
    title: Joi.string().min(3).max(255),
    description: Joi.string().max(2000).allow(''),
    category: Joi.string().max(100).allow(''),
    difficulty: Joi.string().valid('easy', 'medium', 'hard'),
    timeLimit: Joi.number().integer().min(1).max(300).allow(null),
    isPublished: Joi.boolean()
  }),

  // Question schemas
  createQuestion: Joi.object({
    text: Joi.string().min(10).max(1000).required().messages({
      'string.min': 'Question text must be at least 10 characters long',
      'string.max': 'Question text cannot exceed 1000 characters',
      'any.required': 'Question text is required'
    }),
    type: Joi.string().valid('multiple_choice', 'true_false').default('multiple_choice'),
    optionA: Joi.string().max(500).required().messages({
      'any.required': 'Option A is required'
    }),
    optionB: Joi.string().max(500).required().messages({
      'any.required': 'Option B is required'
    }),
    optionC: Joi.string().max(500).allow(''),
    optionD: Joi.string().max(500).allow(''),
    correctAnswer: Joi.string().valid('A', 'B', 'C', 'D').required().messages({
      'any.required': 'Correct answer is required'
    }),
    points: Joi.number().integer().min(1).max(100).default(10),
    explanation: Joi.string().max(1000).allow(''),
    order: Joi.number().integer().min(1).default(1)
  }),

  updateQuestion: Joi.object({
    text: Joi.string().min(10).max(1000),
    type: Joi.string().valid('multiple_choice', 'true_false'),
    optionA: Joi.string().max(500),
    optionB: Joi.string().max(500),
    optionC: Joi.string().max(500).allow(''),
    optionD: Joi.string().max(500).allow(''),
    correctAnswer: Joi.string().valid('A', 'B', 'C', 'D'),
    points: Joi.number().integer().min(1).max(100),
    explanation: Joi.string().max(1000).allow(''),
    order: Joi.number().integer().min(1)
  }),

  // Quiz attempt schema
  submitQuizAttempt: Joi.object({
    answers: Joi.object().pattern(
      Joi.number().integer(),
      Joi.string().valid('A', 'B', 'C', 'D')
    ).required().messages({
      'any.required': 'Answers are required'
    }),
    timeTaken: Joi.number().integer().min(1).allow(null)
  }),

  // Query parameter schemas
  queryParams: {
    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10)
    }),

    quizFilters: Joi.object({
      category: Joi.string().max(100),
      difficulty: Joi.string().valid('easy', 'medium', 'hard'),
      published: Joi.boolean(),
      creator: Joi.number().integer(),
      search: Joi.string().max(255)
    })
  }
};

// Specific validation middleware functions
const validateRegister = validate(schemas.register);
const validateLogin = validate(schemas.login);
const validateUpdateProfile = validate(schemas.updateProfile);
const validateChangePassword = validate(schemas.changePassword);
const validateCreateQuiz = validate(schemas.createQuiz);
const validateUpdateQuiz = validate(schemas.updateQuiz);
const validateCreateQuestion = validate(schemas.createQuestion);
const validateUpdateQuestion = validate(schemas.updateQuestion);
const validateSubmitQuizAttempt = validate(schemas.submitQuizAttempt);
const validatePaginationQuery = validate(schemas.queryParams.pagination, 'query');
const validateQuizFiltersQuery = validate(schemas.queryParams.quizFilters, 'query');

module.exports = {
  validate,
  schemas,
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateCreateQuiz,
  validateUpdateQuiz,
  validateCreateQuestion,
  validateUpdateQuestion,
  validateSubmitQuizAttempt,
  validatePaginationQuery,
  validateQuizFiltersQuery
};