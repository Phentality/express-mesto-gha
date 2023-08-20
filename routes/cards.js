const router = require('express').Router();
const {
  getCards, createCard, deleteCard, setLike, deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:id', deleteCard);
router.post('/', createCard);
router.put('/:id/likes', setLike);
router.delete('/:id/likes', deleteLike);

module.exports = router;
