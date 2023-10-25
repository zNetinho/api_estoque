const router = require("express").Router();

const userController = require("./userRoutes");

router.use('/user', userController);

const ProductsController = require("./ProductsRoutes");

router.use('/product', ProductsController)

module.exports = router