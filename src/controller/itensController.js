const itensModels = require('../models/itensModels');
const { fetchUserLogged } = require('../services/itensService');

const itensController = {
  create: async (req, res) => {
      const token = req.headers?.authorization?.split(' ')[1];
      const creatorUser = await fetchUserLogged(token);
      if(!creatorUser) {
        console.log(creatorUser.nome, "não existe")
      }
    try {
      const item = {
        nome: req.body.nome,
        preco: req.body.preco,
        img: req.body.img,
        estoque: req.body.estoque,
        criadoPor: creatorUser.nome
      }
      await itensModels.create(item);
      return res.status(201).json({ msg: `Item cadastrado com sucesso nome do item: ${item.nome}`})
    } catch (error) {
      throw new Error(`erro inesperado, visite a função create do controller ${error}`)
    }
  },

  listItens: async (req, res) => {
    const idUser = req.headers.id;
    console.log('listItens Function',idUser)

    try {
      const itensModel = itensModels;
      const itens = await itensModel.find();
      return res.status(200).json(itens)
    } catch (error) {
      throw new Error(`Erro inesperado durante o carregamento, função listItens${error.error}`)
    }
  },

  updateItem: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id)
      const token = req.headers.authorization.split(' ')[1];
      const creatorUser = await fetchUserLogged(token);
      const updateItem = {
        nome: req.body.nome,
        preco: req.body.preco,
        img: req.body.img,
        estoque: req.body.estoque,
        atualizadoPor: creatorUser.nome
      }

      await itensModels.findByIdAndUpdate({_id: id}, updateItem);
      return res.status(200).json({ msg: `item alterado com sucesso ${id}`})
    } catch (error) {
      throw new Error(`Erro inesperado durante o carregamento, função updateItem ${error.error}`)
    }
  },

  removeItem: async(req, res) => {
    try {
      const { id } = req.params;
      await itensModels.findByIdAndDelete(id);
      return res.status(200).json({ msg: `Item excluido com sucesso ${id}`})
    } catch (error) {
      throw new Error(`Erro inesperado durante o carregamento, função removeItem ${error.error}`)
    }
  }
}

module.exports = itensController;