var express = require('express');
var router = express.Router();

var balanceController = require('./../../../controllers/balance')
var auth              = require('../../../middlewares/auth')

router.post('/topup', auth.isLogin, balanceController.topup);
router.get('/:userId', auth.isLogin, auth.isAuthUser, balanceController.getBalance);

module.exports = router;
