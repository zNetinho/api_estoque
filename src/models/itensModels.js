const mongoose = require('mongoose');

const { Schema } = mongoose;

const itensModel = new Schema({
    sku: {
        type: Number,
        required: true,
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

module.exports = mongoose.model("Itens", itensModel)