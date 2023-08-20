const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Куда ты не туда забрёл, обратись к инструкции API :)' });
});
app.use(express.static('public'));

app.use((req, res, next) => {
  req.user = {
    _id: '64e1c9b0a21068052f8b49ed',
  };

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(PORT);
