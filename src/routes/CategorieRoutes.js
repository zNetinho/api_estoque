const categoriaController = require('../controller/CategorieController');
const CategoriaModels = require('../models/CategoriaModels');

const router = require('express').Router();

router
  .route("/")
  .get( async (req, res) => categoriaController.fetchCategories(req, res));

module.exports = router;
