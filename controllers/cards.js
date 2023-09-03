const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const mongoose = require('mongoose');
const cardModel = require('../models/card');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const getCards = (req, res, next) => {
  cardModel.find({})
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  const cardID = req.params.id;
  const ownerID = req.user.id;
  return cardModel.findById(cardID).orFail()
    .then((data) => {
      if (!data.owner.equals(ownerID)) {
        throw new ForbiddenError('That card not yours');
      }
      return cardModel.findByIdAndRemove(cardID)
        .then((card) => {
          res.status(HTTP_STATUS_OK).send({ data: card });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Card not found'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Invalid ID'));
      }
      return next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user.id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Invaliad Data'));
      }
      return next(err);
    });
};

const setLike = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((like) => {
      if (like === null) {
        return next(new NotFoundError('Card not found'));
      }
      return res.status(HTTP_STATUS_OK).send(like);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Invalid ID'));
      }
      return next(err);
    });
};

const deleteLike = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((like) => {
      if (like === null) {
        throw new NotFoundError('Card not found');
      }
      return res.status(HTTP_STATUS_OK).send(like);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Invalid ID'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  setLike,
  deleteLike,
};
