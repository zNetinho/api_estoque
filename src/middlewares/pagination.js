async function paginate(req, res, next) {
  try {
    // buscando valores padrão, e definindo valores default da query.
    let { limite = 10, pagina = 1, ordenacao = "_id-1" } = req.query;
    // separando os parametros.
    let [ campoOrdenacao, ordem ] = ordenacao.split(":");
    // pega o resultado que foi passado no controller
    const result = req.result;
    const quantity = result.quantity

    if(limite > 0 && pagina > 0) {
      const resultadoPaginado = await result.find()
        // ordena de A-Z
        .sort({ [campoOrdenacao]: ordem })
        // se pagina 1, então pagina - 1 = 0 x limite = 5
        .skip((pagina -1) * limite)
        // Limite de resultados (10).
        .limit(limite)
        .exec();
        resultadoPaginado.quantityItems = quantity
        console.log(resultadoPaginado)
      res.status(200).json({ resultadoPaginado, quantity });
    }

    limite = parseInt(limite);
    pagina = parseInt(pagina);
    ordem = parseInt(ordem);
  } catch (error) {
      next(error);
  }
}

module.exports = paginate
