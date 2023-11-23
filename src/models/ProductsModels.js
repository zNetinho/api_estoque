const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const ProductsModel = new Schema({
    sku: {
        type: Number,
        required: true
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
        required: true
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

ProductsModel.plugin(mongoosePaginate)

const ProductModelPaginate = mongoose.model("Products", ProductsModel)

ProductModelPaginate.paginate().then({})

module.exports = mongoose.model("Products", ProductsModel)