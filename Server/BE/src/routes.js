const router = require('express').Router();
const index = require('./routes/index');
const users = require('./routes/users');
const storages = require('./routes/storages');
const { handler } = require('./middlewares/wrapper');

router.use('/', index);
router.use('/users', users);
router.use('/storages', storages);

// For test wrapper
// const error = require('./routes/error');
// router.use('/error', error);

function inject(app) {
  app.use(router);
  handler(app);
}

module.exports = {
  inject
};