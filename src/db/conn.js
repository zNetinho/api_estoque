const mongoose = require('mongoose')
require('dotenv').config()

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

mongoose.set("strictQuery", true)

async function main() {
    mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@devagram.zjxhfk7.mongodb.net/projeto-estoque`)
    .then(() => {
        console.log('Conectado ao MongoDB')
    })
    .catch((e) => {
        console.log(e)
    })

}

module.exports = main;