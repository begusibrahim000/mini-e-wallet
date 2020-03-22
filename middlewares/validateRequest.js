const { body }  = require('express-validator/check')

var schemaReq = {
  login: [
    {field: 'email',    type: 'string', required: true},
    {field: 'password', type: 'string', required: true},
  ],
  topup: [
    {field: 'amount',   type: 'number', required: true},
    {field: 'bankId',   type: 'number', required: true},
    {field: 'location', type: 'string', required: true},
  ],
  transfer: [
    {field: 'amount',             type: 'number', required: true},
    {field: 'userIdDestination',  type: 'number', required: true},
    {field: 'location',           type: 'string', required: true},
  ]
}

function createValidationRule (schemaName) {
  var validationRule = []
  var schemas = schemaReq[schemaName]
  for (let schema of schemas ) {
    validationRule.push(
      body(schema.field).custom(value => {
        if(!value) {
          if(schema.required) {
            throw new Error(`Field ${schema.field} is required and must be a ${schema.type}`)      
          } else {
            return true
          }
        } else {
          if(typeof value == schema.type) {
            return true
          } else {
            throw new Error(`Field ${schema.field} must be a ${schema.type}`)
          }
        }
      })
    )
  }
  return validationRule
}

var validate = {
  login          : createValidationRule('login'),
  topup          : createValidationRule('topup'),
  transfer       : createValidationRule('transfer'),
}

module.exports = validate
