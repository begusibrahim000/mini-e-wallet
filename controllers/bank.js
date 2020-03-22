const buildResponse     = require('../helpers/buildResponse')
const handleError       = require('../helpers/handleError')
const models            = require('../models')
const Bank              = models.Bank

module.exports = {
  getAll: (req, res) => {
    Bank.findAll({
      attributes: ['id', 'name', 'abbreviation']
    })
    .then(banks => {
      buildResponse.success(res, banks)
    })
    .catch(err => {handleError(err, res)})
  },
}
