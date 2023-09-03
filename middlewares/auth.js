const {
  HTTP_STATUS_UNAUTHORIZED,
} = require('http2').constants;
const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Authorization required' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Authorization required' });
  }

  req.user = payload;

  next();
};
