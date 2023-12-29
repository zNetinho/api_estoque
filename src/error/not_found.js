const ErroBase = require("./base_error.js");

class NotFound extends ErroBase {
  constructor(msg = "Pagina não encontrada") {
    super(msg, 404);
  }
}

module.exports = NotFound;