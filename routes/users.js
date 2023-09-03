/* eslint-disable no-control-regex */
/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateUserById, updateUserAvatarById, getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userID', celebrate({
  params: Joi.object().keys({
    userID: Joi.string().alphanum().length(24),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserById);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line prefer-regex-literals
    avatar: Joi.string().min(2).pattern(new RegExp('^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$')),
  }),
}), updateUserAvatarById);

module.exports = router;
