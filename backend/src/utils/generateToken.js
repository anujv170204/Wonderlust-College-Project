import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token for authenticated users
 * @param {string} id - The MongoDB User ID
 * @returns {string} Signed JWT token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'staysphere_default_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};
