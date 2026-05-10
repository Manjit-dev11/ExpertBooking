const { query, param } = require('express-validator');

const validateExpertQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  query('category')
    .optional()
    .isIn(['Tech', 'Design', 'Business', 'Marketing', 'Finance', 'Health'])
    .withMessage('Invalid category'),

  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search too long'),
];

const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expert ID format'),
];

module.exports = {
  validateExpertQuery,
  validateObjectId
};
