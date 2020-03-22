const bcrypt            = require('bcryptjs')
const jwt               = require('jsonwebtoken')
const { validationResult } = require('express-validator/check')
const invalidRequest    = "Invalid data provided"

require('dotenv').config()

const buildResponse     = require('../helpers/buildResponse')
const handleError       = require('../helpers/handleError')
const models            = require('../models')
const User              = models.User
const InvalidToken      = models.InvalidToken

module.exports = {

  login: (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      User.findOne({
        attributes: ['id', 'username', 'email', 'password'],
        where: {
          email: req.body.email
        }
      })
      .then(user => {
        if(user) {
          bcrypt.compare(req.body.password, user.password, function(errCheck, resultCheck) {
            if(!errCheck) {
              if(resultCheck == true) {
                // password match
                jwt.sign({
                  user        : { id: user.id, email: user.email },
                  uniqueWord  : process.env.JWT_UNIQUE_WORD
                }, process.env.JWT_SECRET, { expiresIn: "2 days" }, (err, token) => {
                  if(!err) {
                    let payload = {
                      token,
                      user: {
                        username: user.username
                      }
                    }
                    buildResponse.success(res, payload)
                  } else {
                    buildResponse.error(res, null)
                  }
                })
              } else {
                // password not match
                buildResponse.fail(res, 'Wrong email or password' , 401)
              }
            } else {
              buildResponse.error(res, null)
            }
          })
        } else {
          buildResponse.fail(res, 'Wrong email or password' , 401)
        }
      })
      .catch(err => {handleError(err, res)})
    } else {
      buildResponse.fail(res, { reason: invalidRequest, errors: errors.array() })
    }
  },

  logout: (req, res) => {
    let token = req.headers.authorization
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(!err) {
        InvalidToken.findOrCreate({
          where: {
            token: token
          },
          defaults: {
            token,
            expiredAt: decoded.exp,
            creatdAt: new Date(),
            updatedAt: new Date()
          }
        })
        .then(() => {
          buildResponse.success(res, 'successfully logout')
        })
        .catch(err => {handleError(err, res)})
      } else {
        if(err.name == 'TokenExpiredError') buildResponse.success(res, 'successfully logout')
        else buildResponse.fail(res, "Invalid Token")
      }
    })
  },

}
