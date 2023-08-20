const mongoose = require('mongoose');
const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel.find({})
    .then((r) => res.status(200).send(r))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const deleteCard = (req, res) => {
  const cardID = req.params.id;
  return cardModel.findByIdAndRemove(cardID)
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send({ data: r });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((r) => res.status(201).send(r))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Invalid Data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const setLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'Card not found' });
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

const deleteLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((r) => res.status(200).send(r))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  setLike,
  deleteLike,
};
