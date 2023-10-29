const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategoriaSchema = new Schema({
    id:{
      type: Number,
      required: true
    },
    nome: {
      type: String,
      required: true
    },
    descricao: {
      type: String,
      required: true,
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
      required: true
    },
    produtos: {
      type: Array,
      required: true,
      default: []
    }

})

module.exports = mongoose.model("Categoria", CategoriaSchema)
