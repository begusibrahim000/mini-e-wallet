var express = require('express');
var router = express.Router();

var bankController  = require('./../../../controllers/bank')
var auth            = require('../../../middlewares/auth')

router.get('/', auth.isLogin, bankController.getAll);

module.exports = router;
