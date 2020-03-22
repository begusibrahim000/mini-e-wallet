const buildResponse     = require('./buildResponse')

const handleError = (err) => { buildResponse.error(res, err) }

module.exports = handleError;
