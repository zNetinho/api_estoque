const router = require("express").Router();

const userController = require("./userRoutes");

router.use('/user', userController);

const itensController = require("./itensRoutes")

router.use('/itens', itensController)

module.exports = router