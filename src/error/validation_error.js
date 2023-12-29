const RequestIncorreta = require("./request_incorrect.js")

class ValidationErro extends RequestIncorreta {
  constructor() {
    const msgError = Object.values(erro.errors)
    // intera sobre o objeto reescrevendo o erro no erro.message
    .map((erro => erro.message))
    .join("; ")

    super(`Os seguintes erros foram encontrados: ${ msgError }`);
  }
}

module.exports = ValidationErro;