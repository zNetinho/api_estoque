const mongoose = require('mongoose');

const { Schema } = mongoose;

const itensModel = new Schema({
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
    // tasks: {
    //     type: [task]
    // }
})

module.exports = mongoose.model("Itens", itensModel)