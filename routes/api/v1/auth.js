var express = require('express');
var router = express.Router();

var authController = require('./../../../controllers/auth')
var validate        = require('../../../middlewares/validateRequest')

router.post('/login', validate.login, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
