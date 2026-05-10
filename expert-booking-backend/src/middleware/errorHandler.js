function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = null;

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose ValidationError
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Mongoose Duplicate Key Error
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
  }

  // Custom Error with statusCode
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Fallback
  else {
    message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  }

  console.error(`[Error] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== 'production' && statusCode === 500 && { stack: err.stack })
  });
}

module.exports = errorHandler;
