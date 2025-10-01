/**
 * Generate a random 6-digit verification code
 * @returns {string} 6-digit code
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Get verification code expiration time (15 minutes from now)
 * @returns {Date} Expiration date
 */
const getVerificationCodeExpiry = () => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 15); // Code expires in 15 minutes
  return expiryTime;
};

/**
 * Check if verification code is expired
 * @param {Date} expiryDate - Expiration date from database
 * @returns {boolean} True if expired, false otherwise
 */
const isVerificationCodeExpired = (expiryDate) => {
  return new Date() > new Date(expiryDate);
};

module.exports = {
  generateVerificationCode,
  getVerificationCodeExpiry,
  isVerificationCodeExpired
};