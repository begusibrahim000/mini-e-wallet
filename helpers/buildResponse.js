module.exports = {
  success : (responseObject, data) => {
    responseObject.send({
      status  : 'success',
      data
    })
  },
  fail  : (responseObject, data, code = 400) => {
    responseObject.status(code);
    responseObject.send({
      status  : 'fail',
      data
    })
  },
  error : (responseObject, message, code = 500) => {
    responseObject.status(code);
    responseObject.send({
      status  : 'error',
      message
    })
  }
}
