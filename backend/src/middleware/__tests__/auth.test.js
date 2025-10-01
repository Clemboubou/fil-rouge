const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../auth');
const { User } = require('../../models');

// Mock dependencies
jest.mock('../../models');
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token and attach user to request', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        isActive: true
      };

      mockRequest.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ userId: 1 });
      User.findByPk.mockResolvedValue(mockUser);

      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockRequest.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should reject request when no token provided', async () => {
      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. No token provided.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request when token is invalid', async () => {
      mockRequest.headers.authorization = 'Bearer invalid-token';
      jwt.verify.mockImplementation(() => {
        const error = new Error('Invalid token');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Invalid token.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request when token is expired', async () => {
      mockRequest.headers.authorization = 'Bearer expired-token';
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Token expired.'
      });
    });

    it('should reject request when user not found', async () => {
      mockRequest.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ userId: 999 });
      User.findByPk.mockResolvedValue(null);

      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. User not found or inactive.'
      });
    });

    it('should reject request when user is not active', async () => {
      const inactiveUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        isActive: false
      };

      mockRequest.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ userId: 1 });
      User.findByPk.mockResolvedValue(inactiveUser);

      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. User not found or inactive.'
      });
    });

    it('should handle unexpected errors', async () => {
      mockRequest.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error during authentication.'
      });
    });
  });

  describe('authorizeRoles', () => {
    it('should allow access when user has authorized role', () => {
      mockRequest.user = { role: 'admin' };
      const middleware = authorizeRoles('admin', 'trainer');

      middleware(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should allow access when user has one of multiple authorized roles', () => {
      mockRequest.user = { role: 'trainer' };
      const middleware = authorizeRoles('admin', 'trainer');

      middleware(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny access when user role is not authorized', () => {
      mockRequest.user = { role: 'user' };
      const middleware = authorizeRoles('admin', 'trainer');

      middleware(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access when user is not authenticated', () => {
      mockRequest.user = null;
      const middleware = authorizeRoles('admin');

      middleware(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    });
  });

  describe('optionalAuth', () => {
    it('should attach user when valid token provided', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        isActive: true
      };

      mockRequest.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ userId: 1 });
      User.findByPk.mockResolvedValue(mockUser);

      await optionalAuth(mockRequest, mockResponse, mockNext);

      expect(mockRequest.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should continue without user when no token provided', async () => {
      await optionalAuth(mockRequest, mockResponse, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should continue without user when token is invalid', async () => {
      mockRequest.headers.authorization = 'Bearer invalid-token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await optionalAuth(mockRequest, mockResponse, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should continue without user when user is not active', async () => {
      const inactiveUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        isActive: false
      };

      mockRequest.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ userId: 1 });
      User.findByPk.mockResolvedValue(inactiveUser);

      await optionalAuth(mockRequest, mockResponse, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
