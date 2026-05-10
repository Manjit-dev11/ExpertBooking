const express = require('express');
const { getExperts, getExpertById } = require('../controllers/expertController');
const validate = require('../middleware/validate');
const { validateExpertQuery, validateObjectId } = require('../validators/expertValidators');

const router = express.Router();

router.route('/')
  .get(validateExpertQuery, validate, getExperts);

router.route('/:id')
  .get(validateObjectId, validate, getExpertById);

module.exports = router;
