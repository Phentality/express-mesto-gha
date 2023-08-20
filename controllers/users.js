const mongoose = require('mongoose');
const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel.find({})
    .then((r) => res.status(200).send(r))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const getUserById = (req, res) => {
  const { userID } = req.params;
  return userModel.findById(userID)
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(r);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateUserById = (req, res) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Invalid Data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateUserAvatarById = (req, res) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Invalid Data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel.create({ name, about, avatar })
    .then((r) => res.status(201).send(r))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Invalid Data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatarById,
  createUser,
};
