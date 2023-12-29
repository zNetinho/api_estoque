const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategoriaSchema = new Schema({
    id:{
      type: Number,
      // required: true,
      // message: "O campo ID é obrigatório no momento da criação."
    },
    nome: {
      type: String,
      required: true,
      message: "O campo Nome é obrigatório para criar uma categoria."
    },
    descricao: {
      type: String,
      required: true,
      message: "O campo descrição é obrigatório para criar a categoria",
    },
    title_seo: {
      type: String,
      min: 5,
      max: 60,
    },
    descricao_seo: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    texto_acima: {
      type: String,
    },
    texto_abaixo: {
      type: String
    },
    produtos: {
      type: Array,
      required: true,
      default: []
    }

})

module.exports = mongoose.model("Categoria", CategoriaSchema)
