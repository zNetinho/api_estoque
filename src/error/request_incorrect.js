const ErroBase = require("./base_error.js");

class RequestIncorreta extends ErroBase {
  constructor(msg = "Um ou mais dados fornecidos estão incorretos") {
    super(msg, 400);
  }
}

module.exports = RequestIncorreta;