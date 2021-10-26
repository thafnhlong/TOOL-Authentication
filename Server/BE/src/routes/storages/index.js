const router = require('express').Router();
const controller = require('./controller');
const { authenMiddleware } = require('../../middlewares/auth');

router.use(authenMiddleware);

router.post('/', controller.add);
router.get('/compact', controller.compact);
router.get('/:id', controller.checkIdValidationMiddleware, controller.get);
router.put('/:id', controller.checkIdValidationMiddleware, controller.put);
router.delete('/:id', controller.checkIdValidationMiddleware, controller.delete);
router.get('/:id/qr', controller.checkIdValidationMiddleware, controller.qr);

module.exports = router;