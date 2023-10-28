const router = require('express').Router()

const multer = require('multer');
const uploads = require('../config/upload');
const simpleUpload = require('../config/upload');
const utils = require('../shared/utils/funtions');
const ProductsController = require('../controller/ProductsController');

router
  .route('/')
  .post(async (req, res) => {ProductsController.create(req, res)})

router
  .route('/')
  .get(utils.checkToken, async(req, res) => ProductsController.listItens(req, res))

router
  .route('/:id')
  .patch(utils.checkToken, async(req, res) => ProductsController.updateItem(req, res))

router
  .route('/:id')
  .delete(utils.checkToken, async(req, res) => ProductsController.removeProduct(req, res))

router
  .route('/export')
  .get(utils.checkToken, async(req, res) => ProductsController.donwloadCSV(req, res))

router
  .route('/export/upload', uploads.single('arquivo'))
  .post(async(req, res) => ProductsController.uploadFile(req, res))

router
  .route('/adc-massive')
  .post(simpleUpload.single('file'), async(req, res) => ProductsController.massiveAdd(req, res))

router
  .route('/csv/exclude', )
  .delete(uploads.single('file'), async(req, res) => ProductsController.excludeMassive(req, res ))


module.exports = router;