const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_UNAUTHORIZED,
} = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const saltRounds = 10;
const jwtSecret = 'secret';

const getUsers = (req, res) => {
  userModel.find({})
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' }));
};

const getUserById = (req, res) => {
  const { userID } = req.params;
  return userModel.findById(userID).orFail()
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};
function updateModel(dat, req, res) {
  userModel.findByIdAndUpdate(req.user._id, dat, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
}
const updateUserById = (req, res) => {
  const { name, about } = req.body;
  updateModel({ name, about }, req, res);
};

const updateUserAvatarById = (req, res) => {
  const { avatar } = req.body;
  updateModel({ avatar }, req, res);
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, saltRounds, (error, hash) => userModel.create({
    name, about, avatar, email, password: hash,
  })
    .then(() => res.status(HTTP_STATUS_CREATED).send({ message: `User ${email} is registered` }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    }));
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'The fields email and password must be filled in' });
  }
  return userModel.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_FORBIDDEN).send({ message: 'User does not exist' });
      }
      bcrypt.compare(password, user.password, (error, isValid) => {
        if (!isValid) {
          return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Password is not correct' });
        }

        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
          id: user._id,
        }, jwtSecret);
        return res.status(HTTP_STATUS_OK).send({ token });
      });
    })
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' }));
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatarById,
  createUser,
  login,
};
