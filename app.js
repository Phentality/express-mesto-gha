const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', router);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Куда ты не туда забрёл, обратись к инструкции API :)' });
});

app.listen(PORT);
