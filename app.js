const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const router = require('./routes');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().unique(),
    password: Joi.string().required().min(6),
  }),
}), createUser);
app.use(auth);
app.use('/', router);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Куда ты не туда забрёл, обратись к инструкции API :)' });
});
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? 'Server Error'
        : message,
    });
});

app.listen(PORT);
