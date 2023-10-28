const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductsModel = new Schema({
    sku: {
        type: Number,
        min: 1,
        max: 6
    },
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    img: {
        type: Array
    },
    descricao: {
        type: String,
    },
    title_seo: {
        type: String,
        required: true,
        min: 10,
        max: 100,
    },
    description_seo: {
        type: String,
    },
    categoria: {
        type: String,
    },
    slug: {
        type: String,
        required: true
    },
    estoque: {
        type: Number,
        required: true
    },
    criadoPor: {
        type: String,
        required: true
    },
    atualizadoPor: {
        type: String,
        required: false
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model("Products", ProductsModel)