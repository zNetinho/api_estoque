const categoriaController = require('../controller/CategorieController');
const CategoriaModels = require('../models/CategoriaModels');

const router = require('express').Router();

router
  .route("/")
  .get( async (req, res) => categoriaController.fetchCategories(req, res));

router
  .route("/")
  .post( async (req, res) => categoriaController.createCategorie(req, res));

router
  .route("/:id")
  .patch( async (req, res) => categoriaController.editCategorie(req, res));

router
  .route("/:id")
  .delete( async (req, res) => categoriaController.deleteCategorie(req, res));

module.exports = router;
