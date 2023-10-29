const CategoriaModels = require("../models/CategoriaModels");
const { getNextIdCategory, checkCategory } = require("../services/CaetgorieService");
const utils = require('../shared/utils/funtions');

const categoriaController = {

  fetchCategories: async (req, res) => {
    const categorias = await CategoriaModels.find();
    if(!categorias) return res.status(403).json({ message: `error na chamada, por favor verifique a rota`})
    return res.status(200).json({categorias})
  },

  createCategorie: async (req, res) => {
    const id = await getNextIdCategory()
    const slug = utils.createASlug(req.body.nome)
    const categorie = {
      id: id,
      nome: req.body.nome,
      descricao: req.body.descricao.length > 0 ? req.body.descricao : req.body.nome,
      title_seo: req.body.nome,
      descricao_seo: req.body.descricao_seo,
      slug: slug,
    }
    if(checkCategory(req.body.nome)) return res.status(403).json({ message: `Categoria já cadatrada`});
    await CategoriaModels.create(categorie);
    return res.status(200).json({categorie})
  },

  editCategorie: async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(403).json({ message: 'Por favor, envie um id válido.'});

    const categorieToUpdate = {
      nome: req.body.nome,
      descricao: req.body.descricao,
      title_seo: req.body.title_seo,
      descricao_seo: req.body.descricao_seo,
      slug: req.body.slug,
    }

    await CategoriaModels.findOneAndUpdate({_id: id}, categorieToUpdate);
    return res.status(200).json({ message: categorieToUpdate})
  },

  deleteCategorie: async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(403).json({ message: 'Por favor passe o ID, da cateogoria'});
    await CategoriaModels.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Categoria excluída com sucesso.'})
  }
}

module.exports = categoriaController;
