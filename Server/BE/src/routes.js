const router = require('express').Router();
const { handler } = require('./middlewares/wrapper');
const index = require('./routes/index');
const error = require('./routes/error');

router.use('/', index);
router.use('/error', error);

handler(router);
module.exports = router;