const router = require('express').Router();
const controller = require('./controller');

router.get('/async1', controller.async1);
router.get('/async2', controller.async2);
router.get('/sync1', controller.sync1);
router.get('/sync2', controller.sync2);

module.exports = router;