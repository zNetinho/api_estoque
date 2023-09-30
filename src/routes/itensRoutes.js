const router = require('express').Router()

const uploads = require('../config/upload');
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
  .get( async(req, res) => itensController.donwloadCSV(req, res))

router
  .route('/export/upload', uploads.single('arquivo'))
  .post(async(req, res) => itensController.uploadFile(req, res))

router
  .route('/export/edit')
  .patch(async(req, res) => itensController.massiveEdit(req, res))


module.exports = router;