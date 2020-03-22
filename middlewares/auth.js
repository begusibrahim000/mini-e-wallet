const jwt   = require('jsonwebtoken')
require('dotenv').config()

const InvalidToken  = require('../models').InvalidToken
const buildResponse = require('../helpers/buildResponse')

module.exports = {
  isLogin: (req, res, next) => {
    token = req.headers.authorization
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(!err) {
        InvalidToken.findOne({ 
          where: {
            token
          }
        })
        .then(invalidToken => {
          if(invalidToken) buildResponse.fail(res, 'Invalid Token', 401)
          else {
            req._userId     = decoded.user.id
            next()
          }
        })
        .catch(err => {
          buildResponse.error(res, err)
        })
      } else { 
        buildResponse.fail(res, 'Invalid Token', 401)
      }
    })
  },
  isAuthUser: (req, res, next) => {
    if(req.params.userId == req._userId) next()
    else buildResponse.fail(res, 'Access Denied', 401)
  }
}
