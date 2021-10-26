const router = require('express').Router();
const controller = require('./controller');
const { authenMiddleware } = require('../../middlewares/auth');

router.get('/tfa', authenMiddleware, controller.get);
router.put('/tfa', authenMiddleware, controller.put);

module.exports = router;