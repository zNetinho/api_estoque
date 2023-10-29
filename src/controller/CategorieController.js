const CategoriaModels = require("../models/CategoriaModels")

const categoriaController = {

  fetchCategories: async (req, res) => {
    const categorias = await CategoriaModels.find();
    if(!categorias) return res.status(403).json({ message: `error na chamada, por favor verifique a rota`})
    return res.status(200).json({categorias})
  },

}

module.exports = categoriaController;
