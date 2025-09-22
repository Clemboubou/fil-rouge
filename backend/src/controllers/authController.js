const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Register new user
const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, username, role = 'user' } = req.body;

    // If username is provided instead of firstName/lastName, split it
    let first = firstName;
    let last = lastName;

    if (username && !firstName && !lastName) {
      const nameParts = username.trim().split(' ');
      first = nameParts[0] || username;
      last = nameParts.slice(1).join(' ') || 'User';
    }

    // Convert "student" role to "user" for database consistency
    const finalRole = role === 'student' ? 'user' : role;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError('User with this email already exists', 409));
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName: first,
      lastName: last,
      role: finalRole
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email, isActive: true }
    });

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [require('sequelize').Op.ne]: userId }
        }
      });

      if (existingUser) {
        return next(new AppError('Email is already taken by another user', 409));
      }
    }

    // Update user
    const [updatedRows] = await User.update(
      { firstName, lastName, email },
      { where: { id: userId } }
    );

    if (updatedRows === 0) {
      return next(new AppError('User not found', 404));
    }

    // Fetch updated user
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return next(new AppError('Current password is incorrect', 400));
    }

    // Update password
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Generate new token
    const token = generateToken(userId);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { token }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can still provide a proper response
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken
};