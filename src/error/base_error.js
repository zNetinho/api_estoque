class ErroBase extends Error {

  constructor(msgErro = "Erro interno do Servidor", status = 500) {
    super();
    this.message = msgErro;
    this.status = status;
  }

  enviarRes(res) {
    res.status(this.status).send({
      msg: this.message,
      status: this.status
    })
  }

}

module.exports = ErroBase;