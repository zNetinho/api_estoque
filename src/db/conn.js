const mongoose = require('mongoose')
require('dotenv').config()

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

const URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apipaginada.eorpwg7.mongodb.net/projeto-estoque`

mongoose.set("strictQuery", true)

async function main() {
    mongoose.connect(URL)
    .then(() => {
        console.log('Conectado ao MongoDB')
    })
    .catch((e) => {
        console.log(e)
    })
}

module.exports = main;
