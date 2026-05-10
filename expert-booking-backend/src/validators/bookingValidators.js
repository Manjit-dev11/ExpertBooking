const { body, query, param } = require('express-validator');

const validateBooking = [
  body('expertId')
    .isMongoId().withMessage('Invalid expert ID'),

  body('userName')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

  body('userEmail')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email')
    .normalizeEmail(),

  body('userPhone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),

  body('date')
    .notEmpty().withMessage('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be YYYY-MM-DD'),

  body('timeSlot')
    .notEmpty().withMessage('Time slot is required')
    .isString().trim(),

  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes max 500 characters'),
];

const validateEmailQuery = [
  query('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email'),
];

const validateStatusUpdate = [
  param('id')
    .isMongoId().withMessage('Invalid booking ID'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Status must be: pending, confirmed, completed, or cancelled'),
];

module.exports = {
  validateBooking,
  validateEmailQuery,
  validateStatusUpdate
};
