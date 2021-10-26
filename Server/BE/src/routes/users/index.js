const router = require('express').Router();
const controller = require('./controller');
const { authorMiddleware } = require('../../middlewares/auth');

router.post('/login', controller.login);
router.post('/', authorMiddleware, controller.add);
router.get('/', authorMiddleware, controller.get);
router.delete('/:id', authorMiddleware, controller.checkIdValidationMiddleware, controller.delete);
router.patch('/:id', authorMiddleware, controller.checkIdValidationMiddleware, controller.patch);
router.get('/:id/qr', authorMiddleware, controller.checkIdValidationMiddleware, controller.qr);

module.exports = router;