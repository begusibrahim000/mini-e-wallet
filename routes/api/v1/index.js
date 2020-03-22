var express = require('express');
var router = express.Router();

var authRouter = require('./auth')
var balanceRouter = require('./balance')
var banksRouter = require('./banks')

router.use('/auth', authRouter)
router.use('/balance', balanceRouter)
router.use('/banks', banksRouter)

module.exports = router;
