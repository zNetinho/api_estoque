const router = require('express').Router()

const services = require('../services/userService');
const userController = require('./../controller/userController');

router
    .route("/")
    .post((req, res) => userController.create(req, res))

router
    .route("/login")
    .post((req, res) => userController.login(req, res))

router
    .route("/login/:id")
    .get(services.checkToken, async(req, res) => userController.checkCredentials(req, res))

module.exports = router;
