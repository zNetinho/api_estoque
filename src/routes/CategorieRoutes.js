const categoriaController = require('../controller/CategorieController');
const CategoriaModels = require('../models/CategoriaModels');

const router = require('express').Router();

router
  .route("/")
  .get( async (req, res) => categoriaController.fetchCategories(req, res));

router
  .route("/")
  .post( async (req, res, next) => categoriaController.createCategorie(req, res, next));

router
  .route("/products")
  .get( async (req, res) => categoriaController.fetchProducts(req, res))

router
  .route("/:q=")
  .get( async (req, res) => categoriaController.fetchSearch(req, res))


router
  .route("/:slug")
  .get( async (req, res, next) => categoriaController.fetchCategorieSlug(req, res, next))


router
  .route("/:id")
  .patch( async (req, res) => categoriaController.editCategorie(req, res));

router
  .route("/:id")
  .delete( async (req, res) => categoriaController.deleteCategorie(req, res));

module.exports = router;
