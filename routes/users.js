const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUserById, updateUserAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userID', getUserById);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateUserAvatarById);

module.exports = router;
