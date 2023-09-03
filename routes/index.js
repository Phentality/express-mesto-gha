const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  createUser, login,
} = require('../controllers/users');
const { regex } = require('../utils/constants');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
