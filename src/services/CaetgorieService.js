// Importações
const { MongoClient, ServerApiVersion } = require("mongodb");
const CategoriaModels = require("../models/CategoriaModels");

// Variaveis
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@devagram.zjxhfk7.mongodb.net/projeto-estoque`

const dbName = 'projeto-estoque';

const categorieService = {
  getNextIdCategory: async () => {
    const client = new MongoClient(URL, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      console.log(db)
      // Coleção de contadores
      const countersCollection = db.collection('contadores-categorias');
      // Nome do campo que você deseja auto-incrementar
      const campoAutoIncremento = 'userid';
      const result = await countersCollection.findOneAndUpdate(
        { _id: campoAutoIncremento },
        { $inc: { contador: 1 } },
        { returnOriginal: true, upsert: true }
      );
      if (!result.value) {
        // Se o contador não existia antes, pode inicializar com 1 ou outro valor padrão.
        return 1;
      }
      return result.value.contador;
    } finally {
      client.close();
    }
  },

  checkCategory: async (nome) => {
    if(await CategoriaModels.findOne({nome: nome})) return true
  }
}

module.exports = categorieService
