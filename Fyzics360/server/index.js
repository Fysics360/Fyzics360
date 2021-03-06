const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = 3000;
const db = require('./db');

db.sync().then(() => console.log('Database is synced'));

app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'This is a scecret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/api', require('./api'));
app.use('/auth', require('./auth'));

app.use((req, res, next) => {
  path.extname(req.path).length > 0
    ? res.status(404).send('Not found')
    : next();
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

app.listen(PORT, () => {
  console.log(`Feeling lucky on port ${PORT}`);
});

module.exports = app;
