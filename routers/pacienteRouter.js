const pacienteController = require('../controllers/pacienteController');
const router = require('express').Router();

router.route('/').get(pacienteController.getAll);

router.route('/registro').post(pacienteController.createOne);

router
  .route('/:id')
  .get(pacienteController.getOne)
  .delete(pacienteController.deleteOne);

module.exports = router;