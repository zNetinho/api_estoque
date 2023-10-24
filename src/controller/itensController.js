const uploadConfig = require('../config/upload');
const fs = require('fs');
const itensModels = require('../models/itensModels');
const itensService = require('../services/itensService');
const { fetchUserLogged } = require('../shared/utils/funtions');
const { Readable } = require('stream');
const readline = require('readline')

const itensController = {
  create: async (req, res) => {
      const token = req.headers?.authorization?.split(' ')[1];
      const creatorUser = await fetchUserLogged(token);
      if(!creatorUser) {
        return res.status(401).json({ message: `Por favor faça o login`})
      }
    try {
      const item = {
        nome: req.body.nome,
        preco: req.body.preco,
        img: req.body.img,
        estoque: req.body.estoque,
        criadoPor: creatorUser.nome
      }
      if(!item) {
        return res.status(403).json({ message: 'Por favor preencha corretamente as informações.'})
      }
      await itensModels.create(item);
      return res.status(201).json({ msg: `Item cadastrado com sucesso nome do item: ${item.nome}`})
    } catch (error) {
      throw new Error(`erro inesperado, visite a função create do controller ${error}`)
    }
  },

  listItens: async (req, res) => {
    const idUser = req.headers.id;
    console.log('listItens Function',idUser)

    try {
      const itensModel = itensModels;
      const itens = await itensModel.find();
      return res.status(200).json(itens)
    } catch (error) {
      throw new Error(`Erro inesperado durante o carregamento, função listItens${error.error}`)
    }
  },

  updateItem: async (req, res) => {
    try {
      const { sku } = req.params;
      console.log(sku)
      const token = req.headers.authorization.split(' ')[1];
      const creatorUser = await fetchUserLogged(token);
      const updateItem = {
        nome: req.body.nome,
        preco: req.body.preco,
        img: req.body.img,
        estoque: req.body.estoque,
        atualizadoPor: creatorUser.nome
      }

      await itensModels.findByIdAndUpdate({sku: sku}, updateItem);
      return res.status(200).json({ msg: `item alterado com sucesso ${sku}`})
    } catch (error) {
      throw new Error(`Erro inesperado durante o carregamento, função updateItem ${error.error}`)
    }
  },

  removeItem: async(req, res) => {
    try {
      const { id } = req.params;
      await itensModels.findByIdAndDelete(id);
      return res.status(200).json({ msg: `Item excluido com sucesso ${id}`})
    } catch (error) {
      throw new Error(`Erro inesperado durante o carregamento, função removeItem ${error.error}`)
    }
  },

  donwloadCSV: async(req, res) => {
    try {
      const itens = await itensModels.find();
      let filename = await itensService.tocsv(itens);
      console.log(filename)
      res.download(filename)
    } catch (error) {
      console.log(error)
    }
  },

  // Verificar necessidade dessa rota.
  uploadFile: async function (req, res, next) {
    // planilha com os dados atualizado.
    const multer = require('multer');
    // cria uma instância do middleware configurada
    const storage = multer.diskStorage({
    destination: './src/uploads', // Diretório onde os arquivos serão armazenados
    filename: (req, file, cb) => {
        // Define o nome do arquivo como o nome original do arquivo enviado
        cb(null, file.originalname);
    },
    });
    const upload = multer({ storage: storage });  

    upload.single('arquivo')(req, res, (err) => {
    if(err) return console.log(err)
    })
    return res.status(200).json({ message: 'Tudo certo' })
  },

  massiveAdd: async(req, res) => {
    const { file } = req;
    const { buffer } = file;
    const creatorUser = await fetchUserLogged(req);

    const readbleFile = new Readable();
    readbleFile.push(buffer);
    readbleFile.push(null);

    const itensLine = readline.createInterface({
      input: readbleFile,
    });

    const itens = [];

    for await ( let item of itensLine) {
      const itensLineSplit = item.split(',');
      const sku = Number(itensLineSplit[0])

      itens.push({
        sku: sku,
        nome: itensLineSplit[1],
        preco: itensLineSplit[2],
        img: itensLineSplit[3],
        estoque: itensLineSplit[4],
      })
    }

      // valida se o conteudo já existe com base no sku, atualiza se existir, cria se não tiver.
      for await (const item of itens) {
        const itemCloned = await itensModels.findOne({ sku: item.sku });    
        if (itemCloned) {
          await itensModels.updateOne({sku: item.sku}, item);
        } else {
            await itensModels.create({
              sku: item.sku,
              nome: item.nome,
              preco: item.preco,
              img: item.img,
              estoque: item.estoque,
              criadoPor: creatorUser,
            })
        }
      }

    if(itens.length < 0) return res.status(403).json({ message: 'method not allowed'})
    return res.status(200).json({ message: 'Deu certo'});
}
  
}

module.exports = itensController;