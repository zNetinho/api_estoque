const router = require('express').Router()

const itensService = require('../services/itensService');
const itensController = require('./../controller/itensController');

router
  .route('/')
  .post(itensService.checkToken, async(req, res) => itensController.create(req, res))

router
  .route('/')
  .get(itensService.checkToken, async(req, res) => itensController.listItens(req, res))

router
  .route('/:id')
  .patch(itensService.checkToken, async(req, res) => itensController.updateItem(req, res))

router
  .route('/:id')
  .delete(itensService.checkToken, async(req, res) => itensController.removeItem(req, res))

router
  .route('/export')
  .get(async(req, res) => itensController.donwloadCSV(req, res))


module.exports = router;