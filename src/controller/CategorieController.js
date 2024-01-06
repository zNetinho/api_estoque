const NotFound = require("../error/not_found.js");
const RequestIncorreta = require("../error/request_incorrect.js");
const CategoriaModels = require("../models/CategoriaModels.js");
const ProductsModels = require("../models/ProductsModels.js");
const { getNextIdCategory, checkCategory } = require("../services/CaetgorieService.js");
const utils = require('../shared/utils/funtions.js');

const categoriaController = {

  fetchCategories: async (req, res, next) => {
    try {
      const categorias = CategoriaModels.find({}, "-_id -__v");
      const countDocuments = await CategoriaModels.countDocuments({});
      categorias.quantity = countDocuments
      if(!categorias) return res.status(403).json({ message: `error na chamada, por favor verifique a rota`})
      req.result = categorias;
      next();
      // return res.status(200).json(categorias)
    } catch (error) {
      next(error)
    }
  },

  createCategorie: async (req, res, next) => {
    console.log(req.headers)
    
    const slug = utils.createASlug(req.body.nome)
    try {
      const categorie = {
        nome: req.body.nome,
        descricao: req.body.descricao.length > 0 ? req.body.descricao : req.body.nome,
        title_seo: req.body.nome,
        descricao_seo: req.body.descricao_seo,
        slug: slug,
        texto_acima: req.body.texto_acima,
        texto_abaixo: req.body.texto_abaixo,
      }
      if( await checkCategory(req.body.nome)){
        return res.status(401).json({ message: `categora não pode ser criada, ja existe outra com o mesmo nome ${req.body.nome}`})
      };
      if( categorie !== null || undefined) {
        const id = await getNextIdCategory();
        categorie.id = id;
        await CategoriaModels.create(categorie);
        return res.status(201).json({categorie})
      } else {
        next(new RequestIncorreta("Houve um erro com a requisição"))
      }
    } catch (error) {
      next(error)
    }
  },

  editCategorie: async (req, res) => {
    console.log(req)
    const { slug } = req.params;
    if(!slug) return res.status(403).json({ message: 'Por favor, envie um id válido.'});
    try {
      const categorieToUpdate = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        title_seo: req.body.title_seo,
        descricao_seo: req.body.descricao_seo,
        slug: req.body.slug,
      }
      await CategoriaModels.findOneAndUpdate({ slug: slug }, categorieToUpdate);
      return res.status(200).json({ message: categorieToUpdate})
    } catch (error) {
      throw {
        toString: function () {
          return "Por favor verifique a função editCategorie"
        }
      }
    }

  },

  deleteCategorie: async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    if(!id) return res.status(403).json({ message: 'Por favor passe o ID, da cateogoria'});
    try {
      await CategoriaModels.findOneAndDelete(Number(id));
      return res.status(200).json({ message: 'Categoria excluída com sucesso.'})
    } catch (error) {
      console.log(error)
    }
  },

  fetchCategorieSlug: async (req, res, next) => {
    console.log(req)
    try {
      const { slug } = req.params
    if(!slug) {
      return res.status(404).json({ message: "Não encontramos a categoria acessada"})
    }
    const categoria = await CategoriaModels.findOne({ slug });
    console.log("categoria", categoria)
    if( categoria !== null ) {
      return res.status(200).json( categoria )
    } else {
      next(new NotFound("A categoria não foi encontrada"))
    }
    } catch (error) {
      res.status(400).send({ message: `${error.message} - URL da categoria não foi encontrada`})
    }
  },

  fetchProducts: async (req, res) => {
    const skus = req.body.sku;
    const productsCategorias = []
    for (let index = 0; index < skus.length; index++) {
      const element = skus[index];
      console.log(element)
      const product = await ProductsModels.find({sku: element})
      productsCategorias.push(product)
    }

    return res.status(200).json(productsCategorias);
  },

  fetchSearch: async (req, res) => {
    const {searchTerm} = req.body
  }
}

module.exports = categoriaController;
