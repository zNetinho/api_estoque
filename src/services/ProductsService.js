// Importações
const userModel = require('../models/userModels');
const { MongoClient, ServerApiVersion } = require("mongodb");
const json2csv = require('json2csv').Parser;
const fs = require('fs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const ProductsModels = require('../models/ProductsModels');
require('dotenv').config

const dbName = 'contador';

// Variaveis
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@devagram.zjxhfk7.mongodb.net/projeto-estoque`

// Funções auxiliares.
const ProductsService = {
    checkToken: (req, res, next) => {
      // const authHeader = req.headers.authorization;
      // Se encontrar algo no headers, ele vai fazer o split, e transformar em um array separando as palavras
      // pelo espaço e pega o segundo item que e o token sem a palavra Bearer.
      const token = req.headers.authorization.split(' ')[1];
      console.log(token)
      if(!token) {
          return res.status(401).json({ message: 'Acesso não autorizado' })
      }
      try {
          const secret = process.env.SECRET
          jwt.verify(token, secret)
          next();
      } catch (error) {
          console.log(error)
          return res.status(500).json({ message: 'Houve um erro no servidor' })
      }
    },

    checkCredentials: async (req, res) => {
      const id = req.params.id;
      const user = await userModel.findById(id, '-password');
      if (!user) {
          return res.status(404).json({ message: 'Usuario não encontrado' });
      }
      return res.status(200).json({ message: user })
    },

    fetchUserLogged: async (token) => {
        const secret = process.env.SECRET
        const idUser = jwt.decode(token, secret)
        if(!idUser) return null
        const creatorUser = await userModel.findById(idUser.id);
        return creatorUser;
    },
        
    tocsv: async function (itens) {
        try {
            const fields = ['_id', 'nome', 'preco', 'img', 'estoque', 'criadoPor', 'atualizadoPor'];
            const opts = { fields };
            // passar local onde vai armazenar a planilha, gerar um uuid unico para ela
            const filename = './src/exports/' + uuid.v4() + '.csv';            

            const csvSDK = new json2csv(opts);
            // usando a instacia criada, passamos os itens para cria a planilha
            const csv = csvSDK.parse(itens);

            fs.writeFile(filename, csv, function (err) {
                if (err) throw err;
                console.log('file saved');
            });            
        // retorna o nome do item para concatenar para o download.
        return filename;

    } catch (err) {
        console.error(err);
    }

    },

    excludeCSVAfter: async function (res, filename) {
        if(!filename) return res.status(417)
        // function de callback, chamada após o download da planilha
        fs.unlink(filename, (err) => {
            if(err) throw err
            console.log(`file was deleted`)
        });
    },

    massiveEdit: async(req, res, filename) => {
        const planilhaAtualizada = fs.readFile(`./src/uploads/a88ee93d-46b2-418f-8e55-335e85f4926e.csv`);
        console.log(planilhaAtualizada)
    },

    checkProduct: async(product) => {
        const nomeProduto = product.nome;
        console.log(product)
        const productCloned = await ProductsModels.findOne({nome: nomeProduto});
        if(productCloned) return true;
    },

    getNextSequence: async (name) => {
        const MongoClient = require('mongodb').MongoClient;

        const URL = 'mongodb://localhost:27017';
        const dbName = 'contador';
        
        // Função para obter o próximo valor do auto-incremento

        debugger
        
        // Exemplo de como usar a função getNextUserId
        (async () => {
          const novoUserId = await getNextUserId();
          console.log('Próximo UserID:', novoUserId);
        })();
        
        },
        getNextUserId: async () => {
            const client = new MongoClient(URL, { useUnifiedTopology: true });
            try {
              await client.connect();
              const db = client.db(dbName);
              console.log(db)
              // Coleção de contadores
              const countersCollection = db.collection('contadores');
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
    }
              
}

module.exports = ProductsService;