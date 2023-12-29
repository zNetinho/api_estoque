const mongoose = require('mongoose');
const ErroBase = require('../error/base_error.js');
const ValidationErro = require('../error/validation_error.js');
const RequestIncorreta = require('../error/request_incorrect.js');

function manipuladorDeErros(erro, req, res, next) {
  // pode ajudar a descobrir o erro
  console.log(erro) 

  if (erro instanceof mongoose.Error.CastError) {
    new RequestIncorreta().enviarRes(res);
  } else if(erro instanceof mongoose.Error.ValidationError) {
    new ValidationErro().enviarRes(res)
  } else if (erro instanceof ErroBase) {
    erro.enviarRes(res)
  } else {
    new ErroBase().enviarRes(res);
  }
  
}



module.exports = manipuladorDeErros; 