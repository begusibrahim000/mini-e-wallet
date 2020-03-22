var express = require('express');
var router = express.Router();

var authRouter = require('./auth')

router.use('/auth', authRouter)

module.exports = router;
