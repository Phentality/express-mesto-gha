const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? 'Server Error'
        : message,
    });
};

module.exports = errorHandler;
