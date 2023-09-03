const router = require('express').Router();
const {
  getUsers, getUserById, updateUserById, updateUserAvatarById, getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userID', getUserById);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateUserAvatarById);

module.exports = router;
