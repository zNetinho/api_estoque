const router = require('express').Router();

const services = require('../services/userService');
const userController = require('./../controller/userController');

router
    .route("/")
    .post((req, res) => userController.create(req, res));

router
    .route("/login")
    .post((req, res) => userController.login(req, res));
    
router
    .route("/login-info")
    .post((req, res) => userController.fetchUser(req, res));

router
    .route("/login/:id")
    .get(services.checkToken, async(req, res) => userController.checkCredentials(req, res));

router
    .route("/loginGoogle")
    .post(async(req, res) => userController.loginWithEmailAndPassword(req, res));

router
    .route("/")
    .delete( async(req, res) => userController.deleteUser(req, res));

router
    .route("/")
    .get(async(req, res) => userController.listUser(req, res));

router
    .route("/verify-token")
    .get( async (req, res) => userController.verifyToken(req, res))

module.exports = router;
