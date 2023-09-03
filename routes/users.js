const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUserById, updateUserAvatarById, getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userID', celebrate({
  params: Joi.object().keys({
    userID: Joi.string().length(24).hex().required(),
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
    // eslint-disable-next-line no-useless-escape, prefer-regex-literals
    avatar: Joi.string().min(2).pattern(new RegExp('(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?')),
  }),
}), updateUserAvatarById);

module.exports = router;
