const router = require("express").Router();

const userController = require("./userRoutes");

router.use('/user', userController);

const ProductsController = require("./ProductsRoutes");

router.use('/products', ProductsController)

const CategorieController = require("./CategorieRoutes");

router.use('/categorie', CategorieController)

module.exports = router