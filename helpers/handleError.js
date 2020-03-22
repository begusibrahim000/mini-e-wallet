const buildResponse     = require('./buildResponse')

const handleError = (err, res) => { buildResponse.error(res, err) }

module.exports = handleError;
