const express = require('express');
const { createBooking, getBookingsByEmail, updateBookingStatus } = require('../controllers/bookingController');
const validate = require('../middleware/validate');
const { validateBooking, validateEmailQuery, validateStatusUpdate } = require('../validators/bookingValidators');

const router = express.Router();

router.route('/')
  .post(validateBooking, validate, createBooking)
  .get(validateEmailQuery, validate, getBookingsByEmail);

router.route('/:id/status')
  .patch(validateStatusUpdate, validate, updateBookingStatus);

module.exports = router;
