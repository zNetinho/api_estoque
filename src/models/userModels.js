const mongoose = require('mongoose');

const { Schema } = mongoose;

const userModel = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirm_password: {
        type: String,
        required: true
    },
    // tasks: {
    //     type: [task]
    // }
})

module.exports = mongoose.model("User", userModel)