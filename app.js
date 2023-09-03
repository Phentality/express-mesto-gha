const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/notFoundError');
const router = require('./routes');
const errorHandler = require('./middlewares/error-handler');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
// eslint-disable-next-line no-unused-vars
app.use('*', (req, res, next) => next(new NotFoundError('check API instruction')));
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use(errorHandler);

app.listen(PORT);
