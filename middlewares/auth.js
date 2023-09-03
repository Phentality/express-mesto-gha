const {
  HTTP_STATUS_UNAUTHORIZED,
} = require('http2').constants;
const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
