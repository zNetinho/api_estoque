const CategoriaModels = require("../models/CategoriaModels");
const ProductsModels = require("../models/ProductsModels");
const { getNextIdCategory, checkCategory } = require("../services/CaetgorieService");
const utils = require('../shared/utils/funtions');

const categoriaController = {

  fetchCategories: async (req, res) => {
    const categorias = await CategoriaModels.find();
    console.log(categorias)
    if(!categorias) return res.status(403).json({ message: `error na chamada, por favor verifique a rota`})
    return res.status(200).json(categorias)
  },

  createCategorie: async (req, res) => {
    const id = await getNextIdCategory()
    const slug = utils.createASlug(req.body.nome)
    try {
      const categorie = {
        id: id,
        nome: req.body.nome,
        descricao: req.body.descricao.length > 0 ? req.body.descricao : req.body.nome,
        title_seo: req.body.nome,
        descricao_seo: req.body.descricao_seo,
        slug: slug,
      }
      if(checkCategory(req.body.nome)){
        return res.status(404).json({ message: `categora não pode ser criada, ja existe outra com o mesmo nome ${req.body.nome}`})
      };
      await CategoriaModels.create(categorie);
      return res.status(200).json({categorie})
    } catch (error) {
      throw {
        toString: function () {
          return "Verifique a função createCategorie"
        }
      }
    }
  },

  editCategorie: async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(403).json({ message: 'Por favor, envie um id válido.'});
    try {
      const categorieToUpdate = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        title_seo: req.body.title_seo,
        descricao_seo: req.body.descricao_seo,
        slug: req.body.slug,
      }
  
      await CategoriaModels.findOneAndUpdate({_id: id}, categorieToUpdate);
      return res.status(200).json({ message: categorieToUpdate})
    } catch (error) {
      throw {
        toString: function () {
          return "Por favor verifique a função editCategorie"
        }
      }
    }

  },

  deleteCategorie: async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(403).json({ message: 'Por favor passe o ID, da cateogoria'});
    await CategoriaModels.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Categoria excluída com sucesso.'})
  },

  fetchCategorieSlug: async (req, res) => {
    const { slug } = req.params
    if(!slug) {
      return res.status(404).json({ message: "Não encontramos a categoria acessada"})
    }
    const categoria = await CategoriaModels.findOne({ slug });
    if(slug && !categoria) {
      return res.status(404).json({ message: `categoria não encontrada ${req.params}`})
    }
    return res.status(200).json({categoria,})
  },

  fetchProducts: async (req, res) => {
    const skus = req.body.sku;
    const productsCategorias = []
    for (let index = 0; index < skus.length; index++) {
      const element = skus[index];
      console.log(element)
      const product = await ProductsModels.find({sku: element}).limit(2)
      productsCategorias.push(product)
    }

    return res.status(200).json(productsCategorias);
  }
}

module.exports = categoriaController;
