const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller);

module.exports = router;