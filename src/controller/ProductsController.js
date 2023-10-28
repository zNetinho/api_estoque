const ProductsModels = require('../models/ProductsModels');
const ProductsService = require('../services/ProductsService');
const { fetchUserLogged } = require('../shared/utils/funtions');
const { Readable } = require('stream');
const readline = require('readline');
const utils = require('../shared/utils/funtions');


const ProductsController = {
  create: async (req, res) => {
      const creatorUser = await fetchUserLogged(req);
      const sku = await ProductsService.getNextUserId();
      const slug = utils.createASlug(req.body.nome);
      if(!creatorUser) {
        return res.status(401).json({ message: `Por favor faça o login`})
      }
    try {
      const product = {
        sku: sku,
        nome: req.body.nome,
        preco: req.body.preco,
        img: req.body.img,
        descricao: req.body.descricao.length > 0 ? req.body.descricao : req.body.nome,
        title_seo: req.body.nome,
        categoria: req.body.categoria,
        slug: slug,
        estoque: req.body.estoque,
        criadoPor: creatorUser
      }
      if(!product) {
        return res.status(400).json({ message: 'Por favor preencha corretamente as informações.'})
      }
      if(await ProductsService.checkProduct(product)) {
        return res.status(400).json({ message: 'Produto já cadastrado.'})
      }
      
      await ProductsModels.create(product);
      return res.status(201).json({ msg: `Item cadastrado com sucesso nome do item: ${product.nome}`})
    } catch (error) {
      throw new Error(`erro inesperado, visite a função create do controller ${error}`)
    }
  },

  listItens: async (req, res) => {
    try {
      const ProductsModel = ProductsModels;
      const products = await ProductsModel.find();
      return res.status(200).json(products)
    } catch (error) {
      throw new Error(`Erro inesperado durante o carregamento, função listItens${error.error}`)
    }
  },

  updateItem: async (req, res) => {
    try {
      const { id } = req.params;
      const creatorUser = await fetchUserLogged(req);
      let descricao = req.body.descricao.length > 0 ? req.body.descricao : req.body.nome;
      
      const updateProduct = {
        nome: req.body.nome,
        preco: req.body.preco,
        img: req.body.img,
        descricao: descricao,
        title_seo: req.body.nome,
        categoria: req.body.categoria,
        estoque: req.body.estoque,
        atualizadoPor: creatorUser
      }

      await ProductsModels.findByIdAndUpdate({_id: id}, updateProduct);
      return res.status(200).json({ msg: `item alterado com sucesso ${id}`})
    } catch (error) {
      throw new Error(`Erro inesperado durante o carregamento, função updateItem ${error.error}`)
    }
  },

  removeProduct: async(req, res) => {
    try {
      const { id } = req.params;
      await ProductsModels.findByIdAndDelete(id);
      return res.status(200).json({ msg: `Item excluido com sucesso ${id}`})
    } catch (error) {
      throw new Error(`Erro inesperado durante o carregamento, função removeItem ${error.error}`)
    }
  },

  donwloadCSV: async(res) => {
    try {
      const itens = await ProductsModels.find();
      let filename = await ProductsService.tocsv(itens);
      console.log(filename)
      res.download(filename)
    } catch (error) {
      console.log(error)
    }
  },

  uploadFile: async function (req, res, next) {
    // arquivo com os dados atualizado.
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
      const seq = await ProductsService.getNextUserId();

      itens.push({
        sku: seq,
        nome: itensLineSplit[0],
        preco: itensLineSplit[1],
        img: itensLineSplit[2],
        descricao: itensLineSplit[3],
        title_seo: itensLineSplit[0],
        categoria: itensLineSplit[5],
        estoque: itensLineSplit[6],
        slug: utils.createASlug(itensLineSplit[0]),
        criadoPor: creatorUser
      })
    }

      // valida se o conteudo já existe com base no sku, atualiza se existir, cria se não tiver.
      for await (const item of itens) {
        const itemCloned = await ProductsModels.findOne({ sku: item.sku });    
        if (itemCloned) {
          await ProductsModels.updateOne({sku: item.sku}, item);
        } else {
            await ProductsModels.create({
              nome: item.nome,
              preco: item.preco,
              img: item.img,
              descricao: item.descricao,
              title_seo: item.title_seo,
              categoria: item.categoria,
              estoque: item.estoque,
              slug: utils.createASlug(item.slug),
              criadoPor: creatorUser,
            })
        }
      }

    if(itens.length < 0) return res.status(403).json({ message: 'method not allowed'})
    return res.status(200).json({ message: 'Deu certo'});
  },

  excludeMassive: async (req, res) => {
    const { file } = req
    const { buffer } = file;

    const readbleFile = new Readable();
    readbleFile.push(buffer);
    readbleFile.push(null);

    const itens = readline.createInterface({
      input: readbleFile
    })

    for await ( let item of itens) {
      const itensExclude = item.split(',');
      const sku = Number(itensExclude[0]);
      const itemExclude = await ProductsModels.findOneAndDelete({sku: sku})
      console.log(itemExclude)
    }

    return res.status(200).json({ message: 'Ok'})

    }
  
}

module.exports = ProductsController;