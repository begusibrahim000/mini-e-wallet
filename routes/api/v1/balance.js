var express = require('express');
var router = express.Router();

var balanceController = require('./../../../controllers/balance')
var auth              = require('../../../middlewares/auth')
var validate          = require('../../../middlewares/validateRequest')


router.post('/topup', validate.topup, auth.isLogin, balanceController.topup);
router.post('/transfer', validate.transfer, auth.isLogin, balanceController.transfer);
router.get('/:userId', auth.isLogin, auth.isAuthUser, balanceController.getBalance);

module.exports = router;
