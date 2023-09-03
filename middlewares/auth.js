const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Authorization required'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }

  req.user = payload;

  next();
};
