const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ConflictError = require('../errors/conflictError');
const userModel = require('../models/user');

const saltRounds = 10;
const jwtSecret = 'secret';

const getUsers = (req, res, next) => {
  userModel.find({})
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  const { userID } = req.params;
  return userModel.findById(userID).orFail()
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('User not found'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Invalid ID'));
      }
      return next(err);
    });
};
function updateModel(dat, req, res, next) {
  userModel.findByIdAndUpdate(req.user.id, dat, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Invalid Data'));
      }
      return next(err);
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

const getUserInfo = (req, res, next) => {
  userModel.findById(req.user.id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Invalid Data'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, saltRounds, (error, hash) => userModel.create({
    name, about, avatar, email, password: hash,
  })
    .then(() => res.status(HTTP_STATUS_CREATED).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('User with this email already register'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Invalid Data'));
      }
      return next(err);
    }));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError('The fields email and password must be filled in'));
  }
  return userModel.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('User does not exist'));
      }
      bcrypt.compare(password, user.password, (error, isValid) => {
        if (!isValid) {
          return next(new UnauthorizedError('Password is not correct'));
        }

        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
          id: user._id,
        }, jwtSecret);
        return res.status(HTTP_STATUS_OK).cookie('jwt', token).send({ token });
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatarById,
  createUser,
  login,
  getUserInfo,
};
