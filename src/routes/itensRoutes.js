const router = require('express').Router()

const multer = require('multer');
const uploads = require('../config/upload');
const simpleUpload = require('../config/upload');
const utils = require('../shared/utils/funtions');
const itensController = require('./../controller/itensController');

router
  .route('/')
  .post(utils.checkToken, async(req, res) => itensController.create(req, res))

router
  .route('/')
  .get(utils.checkToken, async(req, res) => itensController.listItens(req, res))

router
  .route('/:id')
  .patch(utils.checkToken, async(req, res) => itensController.updateItem(req, res))

router
  .route('/:id')
  .delete(utils.checkToken, async(req, res) => itensController.removeItem(req, res))

router
  .route('/export')
  .get(utils.checkToken, async(req, res) => itensController.donwloadCSV(req, res))

router
  .route('/export/upload', uploads.single('arquivo'))
  .post(async(req, res) => itensController.uploadFile(req, res))

router
  .route('/adc-massive')
  .post(simpleUpload.single('file'), async(req, res) => itensController.massiveAdd(req, res))

router
  .route('/csv/exclude', )
  .delete(uploads.single('file'), async(req, res) => itensController.excludeMassive( req, res ))


module.exports = router;